import { activityModel } from '../models/settingModel.js';

export const activityService = {
  log(entry) {
    return activityModel.log(entry);
  },
  list(limit = 30) {
    return activityModel.findAll({ limit });
  }
};