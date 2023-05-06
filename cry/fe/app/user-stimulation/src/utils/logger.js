import { saveLog } from '../../../common/Logger.js';

export default function(actionMethod, user, data) {
  saveLog({
    log_source: { tag: 'user-stimulation' },
    target_data: { detail: JSON.stringify(data) },
    action_method: actionMethod,
    user,
  });
}
