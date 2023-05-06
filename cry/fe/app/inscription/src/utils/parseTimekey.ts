import dayjs from 'dayjs';

import { TIME_FORMAT } from '@/config/app.config';

export default function (timekey?: number, format: string = TIME_FORMAT): string {
  return timekey ? dayjs(timekey).format(format) : '--';
}
