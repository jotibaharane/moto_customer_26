import {
  createNavigationContainerRef,
  DrawerActions,
  StackActions,
} from '@react-navigation/native';

// import type { any } from './types';

export const navigationRef = createNavigationContainerRef<any>();

// NAVIGATE

export function navigate<T extends keyof any>(screen: T, params?: any[T]) {
  if (!navigationRef.isReady()) return;

  navigationRef.navigate(screen as any, params as any);
}

// PUSH

export function push<T extends keyof any>(screen: T, params?: any[T]) {
  if (!navigationRef.isReady()) return;

  navigationRef.dispatch(StackActions.push(screen as string, params));
}

// BACK

export function goBack() {
  if (!navigationRef.isReady()) return;

  navigationRef.goBack();
}

//  RESET

export function reset<T extends keyof any>(screen: any, params?: any[T]) {
  if (!navigationRef.isReady()) return;
  navigationRef.reset({
    index: 0,
    routes: [
      {
        name: screen as string,
        params, // ✅ pass params
      },
    ],
  });
}

// OPEN DRAWER
export function openDrawer() {
  if (!navigationRef.isReady()) return;

  navigationRef.dispatch(DrawerActions.openDrawer());
}

// CLOSE DRAWER
export function closeDrawer() {
  if (!navigationRef.isReady()) return;

  navigationRef.dispatch(DrawerActions.closeDrawer());
}

// TOGGLE DRAWER
export function toggleDrawer() {
  if (!navigationRef.isReady()) return;

  navigationRef.dispatch(DrawerActions.toggleDrawer());
}
