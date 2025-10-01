import { track } from '@vercel/analytics';

export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    track(eventName, properties);
  };

  const trackPageView = (pageName: string) => {
    track('page_view', { page: pageName });
  };

  const trackUserAction = (action: string, category: string, properties?: Record<string, any>) => {
    track('user_action', {
      action,
      category,
      ...properties
    });
  };

  const trackFleetAction = (action: string, vehicleId?: string, properties?: Record<string, any>) => {
    track('fleet_action', {
      action,
      vehicleId,
      ...properties
    });
  };

  const trackTripAction = (action: string, tripId?: string, properties?: Record<string, any>) => {
    track('trip_action', {
      action,
      tripId,
      ...properties
    });
  };

  const trackMaintenanceAction = (action: string, maintenanceId?: string, properties?: Record<string, any>) => {
    track('maintenance_action', {
      action,
      maintenanceId,
      ...properties
    });
  };





  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackFleetAction,
    trackTripAction,
    trackMaintenanceAction
  };
};
