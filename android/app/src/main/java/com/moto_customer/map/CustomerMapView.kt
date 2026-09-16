package com.moto_customer.map

import android.annotation.SuppressLint
import android.content.ComponentCallbacks2
import android.content.res.Configuration
import android.content.res.Resources
import android.graphics.BitmapFactory
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.text.format.DateFormat
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.widget.FrameLayout
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import androidx.lifecycle.setViewTreeLifecycleOwner
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.ThemedReactContext
import com.mapbox.api.directions.v5.models.RouteOptions
import com.mapbox.geojson.LineString
import com.mapbox.geojson.Point
import com.mapbox.maps.CameraBoundsOptions
import com.mapbox.maps.CameraOptions
import com.mapbox.maps.CoordinateBounds
import com.mapbox.maps.EdgeInsets
import com.mapbox.maps.ImageHolder
import com.mapbox.maps.Style
import com.mapbox.maps.extension.style.layers.addLayer
import com.mapbox.maps.extension.style.layers.generated.LineLayer
import com.mapbox.maps.extension.style.layers.getLayer
import com.mapbox.maps.extension.style.layers.properties.generated.IconAnchor
import com.mapbox.maps.extension.style.layers.properties.generated.LineCap
import com.mapbox.maps.extension.style.layers.properties.generated.LineJoin
import com.mapbox.maps.extension.style.sources.addSource
import com.mapbox.maps.extension.style.sources.generated.GeoJsonSource
import com.mapbox.maps.extension.style.sources.getSource
import com.mapbox.maps.plugin.LocationPuck2D
import com.mapbox.maps.plugin.animation.camera
import com.mapbox.maps.plugin.annotation.annotations
import com.mapbox.maps.plugin.annotation.generated.PointAnnotation
import com.mapbox.maps.plugin.annotation.generated.PointAnnotationManager
import com.mapbox.maps.plugin.annotation.generated.PointAnnotationOptions
import com.mapbox.maps.plugin.annotation.generated.createPointAnnotationManager
import com.mapbox.maps.plugin.locationcomponent.location
import com.mapbox.navigation.base.ExperimentalPreviewMapboxNavigationAPI
import com.mapbox.navigation.base.extensions.applyDefaultNavigationOptions
import com.mapbox.navigation.base.extensions.applyLanguageAndVoiceUnitOptions
import com.mapbox.navigation.base.options.NavigationOptions
import com.mapbox.navigation.base.route.NavigationRoute
import com.mapbox.navigation.base.route.NavigationRouterCallback
import com.mapbox.navigation.base.route.RouterFailure
import com.mapbox.navigation.base.trip.model.RouteProgress
import com.mapbox.navigation.base.trip.model.RouteProgressState
import com.mapbox.navigation.core.MapboxNavigation
import com.mapbox.navigation.core.directions.session.RoutesObserver
import com.mapbox.navigation.core.lifecycle.MapboxNavigationApp
import com.mapbox.navigation.core.lifecycle.MapboxNavigationObserver
import com.mapbox.navigation.core.replay.history.ReplayEventLocation
import com.mapbox.navigation.core.replay.history.ReplayEventUpdateLocation
import com.mapbox.navigation.core.trip.session.LocationMatcherResult
import com.mapbox.navigation.core.trip.session.LocationObserver
import com.mapbox.navigation.core.trip.session.RouteProgressObserver
import com.mapbox.navigation.ui.maps.NavigationStyles
import com.mapbox.navigation.ui.maps.camera.NavigationCamera
import com.mapbox.navigation.ui.maps.camera.data.MapboxNavigationViewportDataSource
import com.mapbox.navigation.ui.maps.camera.lifecycle.NavigationBasicGesturesHandler
import com.mapbox.navigation.ui.maps.camera.state.NavigationCameraState
import com.mapbox.navigation.ui.maps.camera.transition.NavigationCameraTransitionOptions
import com.mapbox.navigation.ui.maps.location.NavigationLocationProvider
import com.mapbox.navigation.ui.maps.route.line.api.MapboxRouteLineApi
import com.mapbox.navigation.ui.maps.route.line.api.MapboxRouteLineView
import com.mapbox.navigation.ui.maps.route.line.model.MapboxRouteLineApiOptions
import com.mapbox.navigation.ui.maps.route.line.model.MapboxRouteLineViewOptions
import com.moto_customer.R
import com.moto_customer.databinding.CustomerMapViewBinding
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.io.IOException
import java.util.Date
import java.util.Locale
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * Single persistent native map for the customer app, covering both screens
 * that used to each carry their own `@rnmapbox/maps` JS component:
 *
 * - "SELECT" (booking/Dashboard): shows the customer's own location plus a
 *   preview route once both pickup and drop are chosen. Plain Maps SDK only
 *   — no Navigation SDK, no trip session, matching the previous
 *   implementation exactly.
 *
 * - "TRACKING" (Reporting/live tracking): following camera + live route
 *   line (same rendering stack as the driver app's TripMapView), but no
 *   maneuver/turn-by-turn instruction banner — driven by the DRIVER's
 *   reported position instead of this device's own GPS. Mapbox's
 *   Navigation SDK expects a real, continuous location feed to compute
 *   camera-following — there is no supported way to hand it discrete
 *   external coordinates directly. Mapbox's own replay/simulation engine
 *   (MapboxReplayer, normally used to replay a recorded test drive) is
 *   repurposed here: each driver position received over the socket is
 *   pushed into it as a replay event, and the trip session is started with
 *   startReplayTripSession() instead of startTripSession() — everything
 *   downstream (puck, camera, route line) then works exactly as it does
 *   for the driver app, just fed by these simulated fixes instead of real
 *   GPS. Because the driver's position only arrives every few seconds (not
 *   the ~1Hz+ a real GPS feed provides), the camera can visibly lag or
 *   jump between updates rather than animate as smoothly as driver's own
 *   real-GPS-driven experience.
 */
@OptIn(ExperimentalPreviewMapboxNavigationAPI::class)
class CustomerMapView(private val reactContext: ThemedReactContext) : FrameLayout(reactContext) {

    private enum class Mode { SELECT, TRACKING }

    private companion object {
        private const val TAG = "CustomerMapView"
        private const val BUTTON_ANIMATION_DURATION = 1500L
        private const val ROUTE_RETRY_DELAY_MS = 3000L

        private const val MARKER_ICON_SCALE = 0.28
        private const val INACTIVE_MARKER_OPACITY = 0.45

        // This app only ever operates within India — restricts panning/
        // zooming so the map can't be dragged out into the ocean or
        // another country.
        private const val INDIA_SOUTHWEST_LNG = 68.0
        private const val INDIA_SOUTHWEST_LAT = 6.5
        private const val INDIA_NORTHEAST_LNG = 97.5
        private const val INDIA_NORTHEAST_LAT = 37.6

        private const val SELECT_PREVIEW_ZOOM = 16.0
        private const val SELECT_PREVIEW_PITCH = 45.0
        private const val SELECT_OWN_LOCATION_ZOOM = 17.0
        private const val SELECT_OWN_LOCATION_PITCH = 40.0
        private const val CAMERA_UPDATE_DISTANCE_METERS = 10.0

        // Statuses reached once the vehicle has finished loading at pickup —
        // from here on the map should show the pickup->drop route and track
        // the driver against the delivery leg. Any other status (including
        // null before the first status arrives) is treated as the pickup
        // leg — driver->pickup route, tracking against the pickup point.
        // Mirrors the driver app's TripMapView.DELIVERY_PHASE_STATUSES
        // convention (explicit delivery allowlist, default to pickup).
        private val DELIVERY_PHASE_STATUSES = setOf(
            "LOADING_COMPLETED",
            "TRIP_STARTED",
            "DRIVER_NEAR_DELIVERY",
            "DRIVER_ARRIVED_DELIVERY",
            "DELIVERY_COMPLETED",
        )

        // SELECT mode's own-location fix is throttled before it ever
        // reaches RN — see the doc comment on maybeEmitOwnLocation().
        private const val OWN_LOCATION_EMIT_THROTTLE_MS = 5000L
        private const val OWN_LOCATION_EMIT_MIN_DISTANCE_METERS = 10.0

        private const val ROUTE_LINE_SOURCE_ID = "customerRouteSource"
        private const val ROUTE_LINE_CASING_ID = "customerRouteLineCasing"
        private const val ROUTE_LINE_ID = "customerRouteLine"

        private const val EMIT_DISTANCE_THRESHOLD_METERS = 15.0
        private const val EMIT_DURATION_THRESHOLD_SECONDS = 5.0
    }

    private val binding = CustomerMapViewBinding.inflate(LayoutInflater.from(reactContext), this, true)
    private val mainHandler = Handler(Looper.getMainLooper())
    private val okHttpClient = OkHttpClient()

    // ---- props from RN ----
    private var mode: Mode = Mode.SELECT
    // 0.0 is the "unset" sentinel, matching this app's own redux convention
    // (see isValidLocation() in src/utils/location.utils.ts) for "no
    // coordinate yet".
    private var pickupLat = 0.0
    private var pickupLng = 0.0
    private var deliveryLat = 0.0
    private var deliveryLng = 0.0
    private var vehicleLat = 0.0
    private var vehicleLng = 0.0
    private var vehicleHeading = 0.0
    private var tripStatus: String? = null

    // MapView is a persistent child of the RN native view. React Native can
    // temporarily detach/reattach it without actually destroying the view —
    // never call MapView.onDestroy() from onDetachedFromWindow(). Maps SDK
    // v11's MapView only exposes onStart()/onStop()/onDestroy().
    private var mapStarted = false
    private var mapDestroyed = false
    private var styleLoaded = false

    // Maps SDK v11's MapView auto-discovers a ViewTreeLifecycleOwner by
    // walking up the view hierarchy and binds its own internal
    // MapboxLifecyclePlugin to whatever it finds — for a MapView embedded
    // in RN's view tree, that resolves to the hosting Activity. That plugin
    // then independently calls onStart()/onStop()/onDestroy() driven by the
    // real Activity's lifecycle, racing this class's own manual calls
    // (driven by attach/detach/onDropViewInstance instead). Supplying this
    // inert stand-in (reaches STARTED once, never changes again) means
    // Mapbox's auto-discovery binds to this instead of the real Activity,
    // leaving this class's own lifecycle calls as the sole owner. See the
    // identical fix (and full incident writeup) in the driver app's
    // TripMapView.kt.
    private val inertLifecycleOwner = object : LifecycleOwner {
        private val registry = LifecycleRegistry(this)
        override val lifecycle: Lifecycle get() = registry
        init {
            registry.currentState = Lifecycle.State.STARTED
        }
    }

    // An Activity hosting a MapView directly is expected to forward
    // onLowMemory/onTrimMemory per Mapbox's own docs; a bare View embedded
    // in RN's tree never receives these automatically.
    private val memoryCallbacks = object : ComponentCallbacks2 {
        override fun onTrimMemory(level: Int) {
            if (level >= ComponentCallbacks2.TRIM_MEMORY_RUNNING_LOW) {
                recoverFromMemoryTrim()
            }
        }

        override fun onConfigurationChanged(newConfig: Configuration) {}

        @Deprecated("Deprecated in Java, still delivered on older API levels")
        override fun onLowMemory() {
            recoverFromMemoryTrim()
        }
    }

    private fun recoverFromMemoryTrim() {
        if (mapDestroyed) return
        runCatching { binding.mapView.onLowMemory() }
        styleLoaded = false
        mainHandler.postDelayed({
            if (!mapDestroyed && mapStarted) loadMapStyle()
        }, 500L)
    }

    private var pointAnnotationManager: PointAnnotationManager? = null
    private var pickupAnnotation: PointAnnotation? = null
    private var deliveryAnnotation: PointAnnotation? = null
    private var lastPickupPoint: Point? = null
    private var lastDeliveryPoint: Point? = null

    // ---- SELECT mode: own location ----
    private var ownLocation: Point? = null
    private var ownHeading: Double = 0.0

    init {
        // Must happen before the MapView ever attaches to the window — see
        // inertLifecycleOwner's own doc comment for why.
        binding.mapView.setViewTreeLifecycleOwner(inertLifecycleOwner)

        context.applicationContext.registerComponentCallbacks(memoryCallbacks)

        binding.recenter.setOnClickListener { handleRecenter() }

        binding.recenterNav.contentDescription = "Recenter on driver"
        binding.recenterNav.setOnClickListener {
            navigationCamera.requestNavigationCameraToFollowing()
            binding.routeOverview.showTextAndExtend(BUTTON_ANIMATION_DURATION)
        }
        binding.routeOverview.contentDescription = "Show full route overview"
        binding.routeOverview.setOnClickListener {
            navigationCamera.requestNavigationCameraToOverview()
            binding.recenterNav.showTextAndExtend(BUTTON_ANIMATION_DURATION)
        }
        binding.routeStatusText.setOnClickListener {
            if (!hasActiveRoute) {
                routeFailureToastShown = false
                routeRequested = false
                lastVehiclePoint?.let { maybeRequestRoute(it) }
            }
        }
    }

    // ============================================================
    // PROPS FROM RN
    // ============================================================

    fun setModeProp(value: String?) {
        val newMode = if (value == "TRACKING") Mode.TRACKING else Mode.SELECT
        if (newMode == mode) return
        mode = newMode
        applyModeVisibility()
        scheduleApplyProps()
    }

    fun setPickupLatitude(value: Double) { pickupLat = value; scheduleApplyProps() }
    fun setPickupLongitude(value: Double) { pickupLng = value; scheduleApplyProps() }
    fun setDeliveryLatitude(value: Double) { deliveryLat = value; scheduleApplyProps() }
    fun setDeliveryLongitude(value: Double) { deliveryLng = value; scheduleApplyProps() }

    fun setVehicleLatitude(value: Double) { vehicleLat = value; scheduleApplyProps() }
    fun setVehicleLongitude(value: Double) { vehicleLng = value; scheduleApplyProps() }
    fun setVehicleHeading(value: Double) { vehicleHeading = value }
    fun setTripStatus(value: String?) { tripStatus = value; scheduleApplyProps() }

    // React Native's Fabric dispatches each @ReactProp setter separately,
    // even when several props change in the same commit (e.g. selecting a
    // delivery address updates deliveryLatitude and deliveryLongitude as
    // two back-to-back calls). Running applyProps() synchronously inside
    // each one meant there was a real, observable moment where e.g.
    // deliveryLat held the new value while deliveryLng still held its old
    // default (0.0, if delivery had never been set before) — and
    // isSetCoordinate() only rejects the exact (0,0) pair, so that
    // half-updated (realLat, 0.0) coordinate (0° longitude — the equator,
    // nowhere near India) read as "valid" and fired a real Directions
    // request for it. Posting defers applyProps() to run once Fabric has
    // finished dispatching every setter in this commit (post() always runs
    // after the current call stack — the one making all these synchronous
    // setter calls — unwinds), so it only ever sees fully-consistent prop
    // values.
    private var applyPropsScheduled = false

    private fun scheduleApplyProps() {
        if (applyPropsScheduled) return
        applyPropsScheduled = true
        post {
            applyPropsScheduled = false
            applyProps()
        }
    }

    private fun applyProps() {
        if (mapDestroyed || !styleLoaded) return
        updateMarkers()

        when (mode) {
            Mode.SELECT -> updateSelectCamera()
            Mode.TRACKING -> handleTrackingVehicleUpdate()
        }
    }

    private fun applyModeVisibility() {
        binding.recenter.visibility = if (mode == Mode.SELECT) View.VISIBLE else View.GONE
        // Unlike driver's TripMapView (where this card only shows once the
        // driver actively starts turn-by-turn), TRACKING mode here IS the
        // "actively navigating" state for the whole screen's lifetime —
        // there's no separate toggle, so the card should just always be
        // visible once tracking starts. routeOverview/recenterNav stay
        // GONE-by-default on purpose: those fade in on demand based on the
        // camera's follow/overview state (see setupTrackingNavigationComponents()).
        binding.tripProgressCard.visibility = if (mode == Mode.TRACKING) View.VISIBLE else View.GONE
        binding.routeOverview.visibility = if (mode == Mode.TRACKING) View.INVISIBLE else View.GONE
        binding.recenterNav.visibility = if (mode == Mode.TRACKING) View.INVISIBLE else View.GONE
    }

    /** 0.0/0.0 is the "unset" sentinel; anything else out of the valid
     * lat/lng range is treated as unset too. */
    private fun isSetCoordinate(lat: Double, lng: Double): Boolean {
        if (lat == 0.0 && lng == 0.0) return false
        return lat in -90.0..90.0 && lng in -180.0..180.0
    }

    private fun isPickupLeg(): Boolean {
        return !DELIVERY_PHASE_STATUSES.contains(tripStatus)
    }

    // ============================================================
    // MARKERS (pickup/delivery — shared by both modes)
    // ============================================================

    private fun updateMarkers() {
        val manager = pointAnnotationManager ?: return

        // Only dim the inactive leg's marker while actively tracking a
        // trip — SELECT mode has no "current leg" concept, both stay full
        // opacity there, matching driver's own idle-vs-navigating split.
        val isDeliveryLeg = mode == Mode.TRACKING && !isPickupLeg()

        updateMarker(
            manager = manager,
            newPoint = if (isSetCoordinate(pickupLat, pickupLng)) Point.fromLngLat(pickupLng, pickupLat) else null,
            lastPoint = lastPickupPoint,
            setLastPoint = { lastPickupPoint = it },
            existing = pickupAnnotation,
            setExisting = { pickupAnnotation = it },
            drawableRes = R.drawable.pickup_marker,
            isActive = mode != Mode.TRACKING || !isDeliveryLeg,
        )

        updateMarker(
            manager = manager,
            newPoint = if (isSetCoordinate(deliveryLat, deliveryLng)) Point.fromLngLat(deliveryLng, deliveryLat) else null,
            lastPoint = lastDeliveryPoint,
            setLastPoint = { lastDeliveryPoint = it },
            existing = deliveryAnnotation,
            setExisting = { deliveryAnnotation = it },
            drawableRes = R.drawable.drop_marker,
            isActive = mode != Mode.TRACKING || isDeliveryLeg,
        )
    }

    private fun updateMarker(
        manager: PointAnnotationManager,
        newPoint: Point?,
        lastPoint: Point?,
        setLastPoint: (Point?) -> Unit,
        existing: PointAnnotation?,
        setExisting: (PointAnnotation?) -> Unit,
        drawableRes: Int,
        isActive: Boolean,
    ) {
        val opacity = if (isActive) 1.0 else INACTIVE_MARKER_OPACITY

        if (newPoint == null) {
            if (existing != null) {
                manager.delete(existing)
                setExisting(null)
            }
            setLastPoint(null)
            return
        }

        if (newPoint == lastPoint && existing != null) {
            if (existing.iconOpacity != opacity) {
                existing.iconOpacity = opacity
                manager.update(existing)
            }
            return
        }

        existing?.let { manager.delete(it) }
        setLastPoint(newPoint)

        val bitmap = BitmapFactory.decodeResource(resources, drawableRes)
        setExisting(
            manager.create(
                PointAnnotationOptions()
                    .withPoint(newPoint)
                    .withIconImage(bitmap)
                    .withIconSize(MARKER_ICON_SCALE)
                    .withIconAnchor(IconAnchor.BOTTOM)
                    .withIconOpacity(opacity)
            )
        )
    }

    // ============================================================
    // SELECT MODE — own location + static preview route (plain Maps SDK,
    // no Navigation SDK — unchanged from before this round).
    // ============================================================

    @SuppressLint("MissingPermission")
    private fun startOwnLocationTracking() {
        binding.mapView.location.apply {
            enabled = true
            pulsingEnabled = true
        }
        binding.mapView.location.addOnIndicatorPositionChangedListener(ownLocationPositionListener)
        binding.mapView.location.addOnIndicatorBearingChangedListener(ownLocationBearingListener)
    }

    private fun stopOwnLocationTracking() {
        binding.mapView.location.removeOnIndicatorPositionChangedListener(ownLocationPositionListener)
        binding.mapView.location.removeOnIndicatorBearingChangedListener(ownLocationBearingListener)
        binding.mapView.location.enabled = false
    }

    // Maps SDK's location indicator fires on every raw GPS/fused-location
    // tick — which, standing still, can still be several times a second
    // from pure sensor jitter. Without throttling this, every tick used to
    // dispatch setCurrentLocation() to Redux, and PickupModal's
    // useGetLocationByLatLngQuery re-fired a reverse-geocode request on
    // every single one of those. A time *and* distance gate means at most
    // one emit per interval, and none at all while genuinely stationary.
    private var lastEmittedOwnLocation: Point? = null
    private var lastEmittedOwnLocationAt: Long = 0L
    private var lastCameraFollowPoint: Point? = null

    private val ownLocationPositionListener = com.mapbox.maps.plugin.locationcomponent.OnIndicatorPositionChangedListener { point ->
        ownLocation = point
        maybeEmitOwnLocation(point)
        updateSelectCamera()
    }

    private val ownLocationBearingListener = com.mapbox.maps.plugin.locationcomponent.OnIndicatorBearingChangedListener { bearing ->
        ownHeading = bearing
    }

    private fun maybeEmitOwnLocation(point: Point) {
        val now = System.currentTimeMillis()
        val last = lastEmittedOwnLocation
        val elapsed = now - lastEmittedOwnLocationAt

        if (last != null &&
            elapsed < OWN_LOCATION_EMIT_THROTTLE_MS &&
            distanceMeters(last, point) < OWN_LOCATION_EMIT_MIN_DISTANCE_METERS
        ) {
            return
        }

        lastEmittedOwnLocation = point
        lastEmittedOwnLocationAt = now
        emitLocationUpdate(point, ownHeading)
    }

    private fun emitLocationUpdate(point: Point, heading: Double) {
        val params = Arguments.createMap()
        params.putDouble("latitude", point.latitude())
        params.putDouble("longitude", point.longitude())
        params.putDouble("heading", heading)
        emitEvent("CustomerMapLocationUpdate", params)
    }

    private var lastSelectCameraModeKey: String = ""

    // Tracked separately from lastCameraFollowPoint (which the single-point
    // PICKUP/DROP/OWN branches below still use) because the BOUNDS branch
    // has two independent coordinates that can each change on their own —
    // gating a re-fit on only one of them (as this used to do, keyed on
    // pickup alone) meant editing drop a second time while pickup stayed
    // put never moved the tracked point, so the camera silently stopped
    // re-framing for drop-only edits.
    private var lastBoundsPickupPoint: Point? = null
    private var lastBoundsDropPoint: Point? = null

    private fun updateSelectCamera() {
        if (mode != Mode.SELECT || mapDestroyed || !styleLoaded) return

        val hasPickup = isSetCoordinate(pickupLat, pickupLng)
        val hasDrop = isSetCoordinate(deliveryLat, deliveryLng)

        val modeKey = when {
            hasPickup && hasDrop -> "BOUNDS"
            hasPickup -> "PICKUP"
            hasDrop -> "DROP"
            else -> "OWN"
        }
        if (modeKey != lastSelectCameraModeKey) {
            lastSelectCameraModeKey = modeKey
            lastCameraFollowPoint = null
            lastBoundsPickupPoint = null
            lastBoundsDropPoint = null
        }

        when {
            hasPickup && hasDrop -> {
                val pickup = Point.fromLngLat(pickupLng, pickupLat)
                val drop = Point.fromLngLat(deliveryLng, deliveryLat)
                if (shouldUpdateBoundsFollow(pickup, drop)) fitBounds(pickup, drop)
                requestPreviewRoute(pickup, drop)
            }
            hasPickup -> {
                val target = Point.fromLngLat(pickupLng, pickupLat)
                if (shouldUpdateCameraFollow(target)) {
                    easeCamera(target, SELECT_PREVIEW_ZOOM, SELECT_PREVIEW_PITCH, null)
                }
                clearSelectRouteLine()
            }
            hasDrop -> {
                val target = Point.fromLngLat(deliveryLng, deliveryLat)
                if (shouldUpdateCameraFollow(target)) {
                    easeCamera(target, SELECT_PREVIEW_ZOOM, SELECT_PREVIEW_PITCH, null)
                }
                clearSelectRouteLine()
            }
            else -> {
                ownLocation?.let {
                    if (shouldUpdateCameraFollow(it)) {
                        easeCamera(it, SELECT_OWN_LOCATION_ZOOM, SELECT_OWN_LOCATION_PITCH, null)
                    }
                }
                clearSelectRouteLine()
            }
        }
    }

    private fun shouldUpdateCameraFollow(target: Point): Boolean {
        val last = lastCameraFollowPoint
        if (last != null && distanceMeters(last, target) < CAMERA_UPDATE_DISTANCE_METERS) {
            return false
        }
        lastCameraFollowPoint = target
        return true
    }

    /** Same idea as shouldUpdateCameraFollow(), but for the BOUNDS branch's
     * two independent coordinates — re-fits if EITHER pickup or drop has
     * moved since the last fit, not just pickup. */
    private fun shouldUpdateBoundsFollow(pickup: Point, drop: Point): Boolean {
        val lastPickup = lastBoundsPickupPoint
        val lastDrop = lastBoundsDropPoint
        val pickupMoved = lastPickup == null || distanceMeters(lastPickup, pickup) >= CAMERA_UPDATE_DISTANCE_METERS
        val dropMoved = lastDrop == null || distanceMeters(lastDrop, drop) >= CAMERA_UPDATE_DISTANCE_METERS
        if (!pickupMoved && !dropMoved) return false
        lastBoundsPickupPoint = pickup
        lastBoundsDropPoint = drop
        return true
    }

    private var previewRouteKey: String = ""
    // A style reload (memory-trim recovery) gets a brand new style object
    // with no sources/layers — without this cache, requestPreviewRoute()
    // would skip re-fetching (previewRouteKey unchanged) and the route
    // line would just be permanently missing after that.
    private var lastPreviewRouteCoordinates: List<Point> = emptyList()

    private fun requestPreviewRoute(pickup: Point, drop: Point) {
        val key = "${pickup.latitude()},${pickup.longitude()}:${drop.latitude()},${drop.longitude()}"
        if (key == previewRouteKey) return
        previewRouteKey = key

        requestDirections(pickup, drop) { result ->
            // Belt-and-suspenders alongside scheduleApplyProps() above: if
            // a newer request has since superseded this one, its response
            // — however it happens to be slower to arrive — must never
            // overwrite whatever the CURRENT key already rendered.
            if (mapDestroyed || mode != Mode.SELECT || key != previewRouteKey) return@requestDirections
            if (result == null) {
                clearSelectRouteLine()
                return@requestDirections
            }
            lastPreviewRouteCoordinates = result.coordinates
            renderSelectRouteLine(result.coordinates)
            // The initial fitBounds(pickup, drop) only frames the two
            // straight-line endpoints — an actual road route almost always
            // curves away from that straight line, so part of the drawn
            // path could sit outside that box, off-screen, looking
            // "disconnected" even though the polyline itself is correct
            // end-to-end. Re-fit using the route's own full geometry once
            // it's known.
            fitBoundsToCoordinates(result.coordinates)
        }
    }

    private fun renderSelectRouteLine(coordinates: List<Point>) {
        if (mapDestroyed || !styleLoaded || coordinates.size < 2) return
        val style = binding.mapView.mapboxMap.style ?: return

        val lineString = LineString.fromLngLats(coordinates)
        val existingSource = style.getSource(ROUTE_LINE_SOURCE_ID) as? GeoJsonSource

        if (existingSource != null) {
            existingSource.geometry(lineString)
            return
        }

        style.addSource(GeoJsonSource.Builder(ROUTE_LINE_SOURCE_ID).geometry(lineString).build())

        if (style.getLayer(ROUTE_LINE_CASING_ID) == null) {
            style.addLayer(
                LineLayer(ROUTE_LINE_CASING_ID, ROUTE_LINE_SOURCE_ID).apply {
                    lineColor("#FFFFFF")
                    lineWidth(10.0)
                    lineCap(LineCap.ROUND)
                    lineJoin(LineJoin.ROUND)
                }
            )
        }
        if (style.getLayer(ROUTE_LINE_ID) == null) {
            style.addLayer(
                LineLayer(ROUTE_LINE_ID, ROUTE_LINE_SOURCE_ID).apply {
                    lineColor("#2E5A99")
                    lineWidth(6.0)
                    lineCap(LineCap.ROUND)
                    lineJoin(LineJoin.ROUND)
                }
            )
        }
    }

    private fun clearSelectRouteLine() {
        if (mapDestroyed || !styleLoaded) return
        val style = binding.mapView.mapboxMap.style ?: return
        val existingSource = style.getSource(ROUTE_LINE_SOURCE_ID) as? GeoJsonSource
        existingSource?.geometry(LineString.fromLngLats(emptyList()))
    }

    private data class DirectionsResult(val coordinates: List<Point>)

    /** SELECT mode's booking-screen preview route only — a plain Directions
     * API call, same as before. TRACKING mode's route now goes through the
     * Navigation SDK's own requestRoutes() instead (see findRoute() below). */
    private fun requestDirections(origin: Point, destination: Point, callback: (DirectionsResult?) -> Unit) {
        val token = context.getString(R.string.mapbox_access_token)
        val coordinates = "${origin.longitude()},${origin.latitude()};${destination.longitude()},${destination.latitude()}"
        val url = "https://api.mapbox.com/directions/v5/mapbox/driving/$coordinates" +
            "?geometries=geojson&overview=full&steps=false&access_token=$token"

        val request = Request.Builder().url(url).build()

        okHttpClient.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.w(TAG, "Directions request failed", e)
                mainHandler.post { callback(null) }
            }

            override fun onResponse(call: Call, response: okhttp3.Response) {
                val result = runCatching {
                    val body = response.body?.string() ?: return@runCatching null
                    val json = JSONObject(body)
                    val routes = json.optJSONArray("routes")
                    if (routes == null || routes.length() == 0) return@runCatching null

                    val route = routes.getJSONObject(0)
                    val geometry = route.getJSONObject("geometry")
                    val coordinatesArray = geometry.getJSONArray("coordinates")

                    val points = ArrayList<Point>(coordinatesArray.length())
                    for (i in 0 until coordinatesArray.length()) {
                        val pair = coordinatesArray.getJSONArray(i)
                        points.add(Point.fromLngLat(pair.getDouble(0), pair.getDouble(1)))
                    }

                    DirectionsResult(coordinates = points)
                }.getOrElse {
                    Log.w(TAG, "Failed to parse directions response", it)
                    null
                }

                response.close()
                mainHandler.post { callback(result) }
            }
        })
    }

    private fun distanceMeters(a: Point, b: Point): Double {
        val earthRadius = 6371000.0
        val lat1 = Math.toRadians(a.latitude())
        val lat2 = Math.toRadians(b.latitude())
        val deltaLat = Math.toRadians(b.latitude() - a.latitude())
        val deltaLng = Math.toRadians(b.longitude() - a.longitude())

        val h = sin(deltaLat / 2).pow(2) + cos(lat1) * cos(lat2) * sin(deltaLng / 2).pow(2)
        return earthRadius * 2 * atan2(sqrt(h), sqrt(1 - h))
    }

    // ============================================================
    // TRACKING MODE — full Navigation SDK, same stack as the driver app's
    // TripMapView, fed by a replay-simulated location instead of real GPS.
    // ============================================================

    private var mapboxNavigation: MapboxNavigation? = null
    private var observerRegistered = false

    private var destinationPoint: Point? = null
    private var routeRequested = false
    private var routeFailureToastShown = false
    private var hasActiveRoute = false
    private var lastVehiclePoint: Point? = null

    private var replaySessionStarted = false
    private var replayStartElapsedRealtime = 0L

    private lateinit var navigationCamera: NavigationCamera
    private lateinit var viewportDataSource: MapboxNavigationViewportDataSource
    private lateinit var routeLineApi: MapboxRouteLineApi
    private lateinit var routeLineView: MapboxRouteLineView

    private val navigationLocationProvider = NavigationLocationProvider()

    private val pixelDensity = Resources.getSystem().displayMetrics.density
    private val followingPadding: EdgeInsets by lazy {
        EdgeInsets(180.0 * pixelDensity, 40.0 * pixelDensity, 190.0 * pixelDensity, 40.0 * pixelDensity)
    }
    private val overviewPadding: EdgeInsets by lazy {
        EdgeInsets(140.0 * pixelDensity, 40.0 * pixelDensity, 160.0 * pixelDensity, 40.0 * pixelDensity)
    }

    // Last values actually pushed to RN — the throttle gate for maybeEmitRouteInfo.
    private var lastEmittedDistanceMeters: Double? = null
    private var lastEmittedDurationSeconds: Double? = null

    private fun setupTrackingNavigationComponents() {
        viewportDataSource = MapboxNavigationViewportDataSource(binding.mapView.mapboxMap)
        navigationCamera = NavigationCamera(binding.mapView.mapboxMap, binding.mapView.camera, viewportDataSource)

        binding.mapView.camera.addCameraAnimationsLifecycleListener(
            NavigationBasicGesturesHandler(navigationCamera)
        )
        navigationCamera.registerNavigationCameraStateChangeObserver { navigationCameraState ->
            when (navigationCameraState) {
                NavigationCameraState.TRANSITION_TO_FOLLOWING,
                NavigationCameraState.FOLLOWING -> binding.recenterNav.visibility = View.INVISIBLE
                NavigationCameraState.TRANSITION_TO_OVERVIEW,
                NavigationCameraState.OVERVIEW,
                NavigationCameraState.IDLE -> if (mode == Mode.TRACKING) binding.recenterNav.visibility = View.VISIBLE
            }
        }

        viewportDataSource.followingPadding = followingPadding
        viewportDataSource.overviewPadding = overviewPadding

        val mapboxRouteLineViewOptions = MapboxRouteLineViewOptions.Builder(context)
            .routeLineBelowLayerId("road-label-navigation")
            .build()
        routeLineApi = MapboxRouteLineApi(MapboxRouteLineApiOptions.Builder().build())
        routeLineView = MapboxRouteLineView(mapboxRouteLineViewOptions)

        // Same top-down truck asset as the driver app's own puck — Mapbox
        // rotates it to match the (replay-simulated) bearing.
        binding.mapView.location.apply {
            setLocationProvider(navigationLocationProvider)
            locationPuck = LocationPuck2D(
                bearingImage = ImageHolder.Companion.from(R.drawable.truck_navigation_3d)
            )
            puckBearingEnabled = true
            enabled = true
        }
    }

    private fun computeTrackingTarget(): Point? {
        return if (isPickupLeg()) {
            if (isSetCoordinate(pickupLat, pickupLng)) Point.fromLngLat(pickupLng, pickupLat) else null
        } else {
            if (isSetCoordinate(deliveryLat, deliveryLng)) Point.fromLngLat(deliveryLng, deliveryLat) else null
        }
    }

    private fun handleTrackingVehicleUpdate() {
        if (mode != Mode.TRACKING || mapDestroyed || !styleLoaded) return
        if (!isSetCoordinate(vehicleLat, vehicleLng)) return

        val point = Point.fromLngLat(vehicleLng, vehicleLat)
        lastVehiclePoint = point

        pushReplayLocation(point, vehicleHeading)
        maybeRequestRoute(point)
    }

    // ------------------------------------------------------------
    // REPLAY — feeds the driver's reported position into the Navigation
    // SDK's trip session as if it were live GPS. See the class doc comment
    // for why this exists instead of a direct location feed.
    // ------------------------------------------------------------

    private fun ensureReplaySessionStarted() {
        val navigation = mapboxNavigation ?: return
        if (replaySessionStarted) return
        replaySessionStarted = true
        replayStartElapsedRealtime = SystemClock.elapsedRealtime()
        navigation.startReplayTripSession(false)
        navigation.mapboxReplayer.play()
    }

    private fun pushReplayLocation(point: Point, heading: Double) {
        val navigation = mapboxNavigation ?: return
        ensureReplaySessionStarted()

        // Timestamped against real elapsed time since the replay started
        // (not a fixed increment per push) so each pushed fix is scheduled
        // to play back essentially immediately — the closest this
        // mechanism gets to "live", since the replayer otherwise paces
        // events out according to their own timestamps.
        val elapsedSeconds = (SystemClock.elapsedRealtime() - replayStartElapsedRealtime) / 1000.0

        navigation.mapboxReplayer.pushEvents(
            listOf(
                ReplayEventUpdateLocation(
                    elapsedSeconds,
                    ReplayEventLocation(
                        lon = point.longitude(),
                        lat = point.latitude(),
                        provider = "CustomerMapView",
                        time = null,
                        altitude = null,
                        accuracyHorizontal = null,
                        bearing = heading,
                        speed = null,
                    )
                )
            )
        )
    }

    // ------------------------------------------------------------
    // ROUTE
    // ------------------------------------------------------------

    private fun maybeRequestRoute(currentPoint: Point) {
        val newTarget = computeTrackingTarget()
        if (newTarget != destinationPoint) {
            // Leg changed (pickup -> delivery, or coordinates corrected) —
            // never leave the previous leg's stale route/progress on screen.
            destinationPoint = newTarget
            routeRequested = false
            routeFailureToastShown = false
            hasActiveRoute = false
            lastEmittedDistanceMeters = null
            lastEmittedDurationSeconds = null
            mapboxNavigation?.setNavigationRoutes(emptyList())
            showRouteLoading()
        }

        val destination = destinationPoint ?: return
        if (routeRequested) return
        routeRequested = true
        showRouteLoading()
        findRoute(destination, currentPoint, vehicleHeading)
    }

    private fun findRoute(destination: Point, origin: Point, heading: Double) {
        val navigation = mapboxNavigation
        if (navigation == null) {
            routeRequested = false
            showRouteError("Unable to calculate route · Tap to retry")
            return
        }

        navigation.requestRoutes(
            RouteOptions.builder()
                .applyDefaultNavigationOptions()
                .applyLanguageAndVoiceUnitOptions(context)
                .coordinatesList(listOf(origin, destination))
                .bearingsList(
                    listOf(
                        com.mapbox.api.directions.v5.models.Bearing.builder().angle(heading).degrees(45.0).build(),
                        null
                    )
                )
                .build(),
            object : NavigationRouterCallback {
                override fun onCanceled(routeOptions: RouteOptions, routerOrigin: String) {
                    if (destination != destinationPoint) return
                    routeRequested = false
                }

                override fun onFailure(reasons: List<RouterFailure>, routeOptions: RouteOptions) {
                    if (destination != destinationPoint) return
                    Log.w(TAG, "Route request failed: ${reasons.joinToString { it.message }}")
                    if (!routeFailureToastShown) {
                        routeFailureToastShown = true
                    }
                    showRouteError("Unable to calculate route · Tap to retry")
                    mainHandler.postDelayed({ routeRequested = false }, ROUTE_RETRY_DELAY_MS)
                }

                override fun onRoutesReady(routes: List<NavigationRoute>, routerOrigin: String) {
                    // The leg (pickup/delivery) may have changed again
                    // while this request was in flight — a slow, now-stale
                    // response for the OLD destination must never overwrite
                    // whatever the CURRENT destination already has active.
                    if (destination != destinationPoint) return
                    mapboxNavigation?.setNavigationRoutes(routes)
                    hasActiveRoute = true
                    showRouteStats()
                    navigationCamera.requestNavigationCameraToFollowing()
                }
            }
        )
    }

    // ------------------------------------------------------------
    // OBSERVERS — identical division of responsibility to the driver app's
    // TripMapView: RouteProgressObserver is the only source for live
    // remaining distance/duration; RoutesObserver only renders the line.
    // ------------------------------------------------------------

    private val locationObserver = object : LocationObserver {
        override fun onNewRawLocation(rawLocation: com.mapbox.common.location.Location) {}

        override fun onNewLocationMatcherResult(locationMatcherResult: LocationMatcherResult) {
            val enhancedLocation = locationMatcherResult.enhancedLocation

            navigationLocationProvider.changePosition(
                location = enhancedLocation,
                keyPoints = locationMatcherResult.keyPoints,
            )

            if (mode == Mode.TRACKING && mapStarted) {
                viewportDataSource.onLocationChanged(enhancedLocation)
                viewportDataSource.evaluate()
            }
        }
    }

    private val routeProgressObserver = RouteProgressObserver { routeProgress ->
        if (!hasActiveRoute) return@RouteProgressObserver

        viewportDataSource.onRouteProgressChanged(routeProgress)
        viewportDataSource.evaluate()

        updateProgressCard(routeProgress)

        if (routeProgress.currentState == RouteProgressState.COMPLETE) {
            binding.routeStatusText.text = "Arrived"
            binding.routeStatusText.visibility = View.VISIBLE
            binding.tripStatsRow.visibility = View.GONE
        }
    }

    private val routesObserver = RoutesObserver { routeUpdateResult ->
        if (routeUpdateResult.navigationRoutes.isNotEmpty()) {
            routeLineApi.setNavigationRoutes(routeUpdateResult.navigationRoutes) { value ->
                if (mapDestroyed || !mapStarted || !styleLoaded) return@setNavigationRoutes
                binding.mapView.mapboxMap.style?.let { style ->
                    routeLineView.renderRouteDrawData(style, value)
                    binding.mapView.invalidate()
                }
            }
            viewportDataSource.onRouteChanged(routeUpdateResult.navigationRoutes.first())
            viewportDataSource.evaluate()
        } else {
            val style = binding.mapView.mapboxMap.style
            if (style != null) {
                routeLineApi.clearRouteLine { value ->
                    if (mapDestroyed || !mapStarted || !styleLoaded) return@clearRouteLine
                    binding.mapView.mapboxMap.style?.let { currentStyle ->
                        routeLineView.renderClearRouteLineValue(currentStyle, value)
                        binding.mapView.invalidate()
                    }
                }
            }
            viewportDataSource.clearRouteData()
            viewportDataSource.evaluate()
        }
    }

    private val navigationObserver = object : MapboxNavigationObserver {
        override fun onAttached(mapboxNavigation: MapboxNavigation) {
            this@CustomerMapView.mapboxNavigation = mapboxNavigation
            mapboxNavigation.registerRoutesObserver(routesObserver)
            mapboxNavigation.registerLocationObserver(locationObserver)
            mapboxNavigation.registerRouteProgressObserver(routeProgressObserver)

            // A vehicle position may already have arrived (as props) before
            // this observer finished attaching — don't wait for the next one.
            lastVehiclePoint?.let { handleTrackingVehicleUpdate() }
        }

        override fun onDetached(mapboxNavigation: MapboxNavigation) {
            mapboxNavigation.unregisterRoutesObserver(routesObserver)
            mapboxNavigation.unregisterLocationObserver(locationObserver)
            mapboxNavigation.unregisterRouteProgressObserver(routeProgressObserver)
            this@CustomerMapView.mapboxNavigation = null
        }
    }

    private fun attachNavigation() {
        if (mapDestroyed || observerRegistered || mode != Mode.TRACKING) return

        val lifecycleOwner = reactContext.currentActivity as? LifecycleOwner
        if (lifecycleOwner == null) {
            postDelayed({ attachNavigation() }, 200L)
            return
        }

        MapboxNavigationApp.setup(NavigationOptions.Builder(context).build())
        MapboxNavigationApp.attach(lifecycleOwner)
        MapboxNavigationApp.registerObserver(navigationObserver)
        observerRegistered = true
    }

    // ------------------------------------------------------------
    // PROGRESS CARD — single source of truth is RouteProgress.
    // ------------------------------------------------------------

    private fun showRouteLoading() {
        binding.routeStatusText.text = "Calculating route…"
        binding.routeStatusText.setOnClickListener(null)
        binding.routeStatusText.visibility = View.VISIBLE
        binding.tripStatsRow.visibility = View.GONE
    }

    private fun showRouteError(message: String) {
        binding.routeStatusText.text = message
        binding.routeStatusText.visibility = View.VISIBLE
        binding.tripStatsRow.visibility = View.GONE
    }

    private fun showRouteStats() {
        binding.routeStatusText.visibility = View.GONE
        binding.tripStatsRow.visibility = View.VISIBLE
    }

    private fun updateProgressCard(routeProgress: RouteProgress) {
        val distanceMeters = routeProgress.distanceRemaining.toDouble()
        val durationSeconds = routeProgress.durationRemaining
        val etaMillis = System.currentTimeMillis() + (durationSeconds * 1000).toLong()

        binding.tripDistanceText.text = formatDistance(distanceMeters)
        binding.tripDurationText.text = formatDuration(durationSeconds)
        binding.tripEtaText.text = formatEta(etaMillis)

        maybeEmitRouteInfo(distanceMeters, durationSeconds, etaMillis)
    }

    private fun maybeEmitRouteInfo(distanceMeters: Double, durationSeconds: Double, etaMillis: Long) {
        val lastDistance = lastEmittedDistanceMeters
        val lastDuration = lastEmittedDurationSeconds

        val changedMeaningfully = lastDistance == null || lastDuration == null ||
            Math.abs(distanceMeters - lastDistance) >= EMIT_DISTANCE_THRESHOLD_METERS ||
            Math.abs(durationSeconds - lastDuration) >= EMIT_DURATION_THRESHOLD_SECONDS

        if (!changedMeaningfully) return

        lastEmittedDistanceMeters = distanceMeters
        lastEmittedDurationSeconds = durationSeconds

        val params = Arguments.createMap()
        params.putDouble("distanceMeters", distanceMeters)
        params.putDouble("durationSeconds", durationSeconds)
        params.putDouble("etaMillis", etaMillis.toDouble())
        params.putString("distanceText", formatDistance(distanceMeters))
        params.putString("durationText", formatDuration(durationSeconds))
        params.putString("etaText", formatEta(etaMillis))
        emitEvent("CustomerMapRouteInfo", params)
    }

    private fun formatDistance(meters: Double): String {
        return if (meters >= 1000) String.format(Locale.US, "%.1f km", meters / 1000) else "${meters.toInt()} m"
    }

    private fun formatDuration(seconds: Double): String {
        val totalMinutes = (seconds / 60).toInt()
        if (totalMinutes < 1) return "<1 min"
        if (totalMinutes < 60) return "$totalMinutes min"
        val hours = totalMinutes / 60
        val minutes = totalMinutes % 60
        return if (minutes == 0) "$hours hr" else "$hours hr $minutes min"
    }

    private fun formatEta(etaMillis: Long): String {
        return DateFormat.getTimeFormat(context).format(Date(etaMillis))
    }

    // ============================================================
    // CAMERA HELPERS (SELECT mode)
    // ============================================================

    private fun easeCamera(point: Point, zoom: Double, pitch: Double, bearing: Double?) {
        if (mapDestroyed || !mapStarted) return
        val builder = CameraOptions.Builder().center(point).zoom(zoom).pitch(pitch)
        if (bearing != null) builder.bearing(bearing)
        binding.mapView.camera.easeTo(builder.build())
    }

    private fun fitBounds(a: Point, b: Point) {
        fitBoundsToCoordinates(listOf(a, b))
    }

    /** Fits the camera to a full set of coordinates, not just two
     * endpoints — needed for an actual route polyline, whose curves can
     * extend well outside the straight-line box between its start/end. */
    private fun fitBoundsToCoordinates(coordinates: List<Point>) {
        if (mapDestroyed || !mapStarted || coordinates.isEmpty()) return
        val cameraOptions = binding.mapView.mapboxMap.cameraForCoordinates(
            coordinates,
            CameraOptions.Builder().pitch(0.0).build(),
            EdgeInsets(120.0, 80.0, 120.0, 80.0),
            null,
            null,
        )
        binding.mapView.camera.easeTo(cameraOptions)
    }

    private fun restrictToIndiaBounds() {
        if (mapDestroyed) return
        val bounds = CoordinateBounds(
            Point.fromLngLat(INDIA_SOUTHWEST_LNG, INDIA_SOUTHWEST_LAT),
            Point.fromLngLat(INDIA_NORTHEAST_LNG, INDIA_NORTHEAST_LAT),
        )
        runCatching {
            binding.mapView.mapboxMap.setBounds(CameraBoundsOptions.Builder().bounds(bounds).build())
        }
    }

    private fun handleRecenter() {
        ownLocation?.let { easeCamera(it, SELECT_OWN_LOCATION_ZOOM, SELECT_OWN_LOCATION_PITCH, null) }
    }

    // ============================================================
    // MAP STYLE / LIFECYCLE
    // ============================================================

    private fun loadMapStyle() {
        if (mapDestroyed || !mapStarted) return

        if (styleLoaded) {
            binding.mapView.invalidate()
            return
        }

        val styleUri = if (mode == Mode.TRACKING) NavigationStyles.NAVIGATION_DAY_STYLE else Style.MAPBOX_STREETS

        binding.mapView.mapboxMap.loadStyle(styleUri) { style ->
            if (mapDestroyed || !mapStarted) return@loadStyle
            styleLoaded = true

            restrictToIndiaBounds()

            if (pointAnnotationManager == null) {
                pointAnnotationManager = binding.mapView.annotations.createPointAnnotationManager()
            }

            when (mode) {
                Mode.SELECT -> {
                    startOwnLocationTracking()
                    if (lastPreviewRouteCoordinates.isNotEmpty()) {
                        renderSelectRouteLine(lastPreviewRouteCoordinates)
                    }
                }
                Mode.TRACKING -> {
                    if (!::navigationCamera.isInitialized) {
                        setupTrackingNavigationComponents()
                    }
                    runCatching { routeLineView.initializeLayers(style) }
                    attachNavigation()
                }
            }

            updateMarkers()
            applyProps()

            binding.mapView.invalidate()
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()

        if (mapDestroyed) {
            Log.w(TAG, "CustomerMapView was already destroyed; ignoring re-attach")
            return
        }

        post {
            if (mapDestroyed) return@post

            try {
                if (!mapStarted) {
                    binding.mapView.onStart()
                    mapStarted = true
                }

                if (!styleLoaded) {
                    loadMapStyle()
                } else {
                    binding.mapView.invalidate()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to start/resume CustomerMapView", e)
            }
        }
    }

    override fun onDetachedFromWindow() {
        // React Native can temporarily detach this view during a normal
        // screen transition. Keep the MapView/renderer/style alive —
        // permanent cleanup only happens in destroyMapView().
        super.onDetachedFromWindow()
    }

    fun destroyMapView() {
        if (mapDestroyed) return
        mapDestroyed = true
        Log.d(TAG, "Permanently destroying CustomerMapView")

        runCatching { context.applicationContext.unregisterComponentCallbacks(memoryCallbacks) }
        mainHandler.removeCallbacksAndMessages(null)
        stopOwnLocationTracking()

        if (observerRegistered) {
            runCatching { MapboxNavigationApp.unregisterObserver(navigationObserver) }
            observerRegistered = false
        }

        if (::routeLineApi.isInitialized) runCatching { routeLineApi.cancel() }
        if (::routeLineView.isInitialized) runCatching { routeLineView.cancel() }

        runCatching { mapboxNavigation?.setNavigationRoutes(emptyList()) }
        mapboxNavigation = null

        if (mapStarted) {
            runCatching { binding.mapView.onStop() }
            mapStarted = false
            styleLoaded = false
        }

        runCatching { binding.mapView.onDestroy() }
    }

    private fun emitEvent(name: String, params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(name, params)
    }
}
