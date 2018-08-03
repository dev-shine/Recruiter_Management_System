import Confirmation from './Confirmation';
import { createConfirmation } from 'react-confirm';

const defaultConfirmation = createConfirmation(Confirmation);

export function confirm(confirmation, options = {}) {
  return defaultConfirmation({ confirmation, ...options });
}
