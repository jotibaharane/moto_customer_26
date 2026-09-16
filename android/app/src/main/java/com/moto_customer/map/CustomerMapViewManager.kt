package com.moto_customer.map

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class CustomerMapViewManager : SimpleViewManager<CustomerMapView>() {

    override fun getName(): String = "CustomerMapView"

    override fun createViewInstance(
        reactContext: ThemedReactContext
    ): CustomerMapView = CustomerMapView(reactContext)

    @ReactProp(name = "mode")
    fun setMode(view: CustomerMapView, value: String?) {
        view.setModeProp(value)
    }

    @ReactProp(name = "pickupLatitude", defaultDouble = 0.0)
    fun setPickupLatitude(view: CustomerMapView, value: Double) {
        view.setPickupLatitude(value)
    }

    @ReactProp(name = "pickupLongitude", defaultDouble = 0.0)
    fun setPickupLongitude(view: CustomerMapView, value: Double) {
        view.setPickupLongitude(value)
    }

    @ReactProp(name = "deliveryLatitude", defaultDouble = 0.0)
    fun setDeliveryLatitude(view: CustomerMapView, value: Double) {
        view.setDeliveryLatitude(value)
    }

    @ReactProp(name = "deliveryLongitude", defaultDouble = 0.0)
    fun setDeliveryLongitude(view: CustomerMapView, value: Double) {
        view.setDeliveryLongitude(value)
    }

    @ReactProp(name = "vehicleLatitude", defaultDouble = 0.0)
    fun setVehicleLatitude(view: CustomerMapView, value: Double) {
        view.setVehicleLatitude(value)
    }

    @ReactProp(name = "vehicleLongitude", defaultDouble = 0.0)
    fun setVehicleLongitude(view: CustomerMapView, value: Double) {
        view.setVehicleLongitude(value)
    }

    @ReactProp(name = "vehicleHeading", defaultDouble = 0.0)
    fun setVehicleHeading(view: CustomerMapView, value: Double) {
        view.setVehicleHeading(value)
    }

    @ReactProp(name = "tripStatus")
    fun setTripStatus(view: CustomerMapView, value: String?) {
        view.setTripStatus(value)
    }

    override fun onDropViewInstance(view: CustomerMapView) {
        view.destroyMapView()
        super.onDropViewInstance(view)
    }
}
