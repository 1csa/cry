import moment from 'moment';
import { comp_sortway_map } from "@/data";

export type MonitorScreen = {
  start_date?: string;
  end_date?: string;
  app_name?: string | Array<string>;
  hotspot?: string;
  device_id?: string;
  kws?: string;
  order: keyof typeof comp_sortway_map;
  pub_status?: string;
};

export type SearchProps = {
  date?: [moment.Moment, moment.Moment];
  app_name?: string | Array<string>;
  hotspot?: string;
  device_id?: string;
  kws?: string;
  order: keyof typeof comp_sortway_map;
  pub_status: string;
};

export type CompetitorMonitorProps = {
  id: number;
  mid: string;
  push_title: string;
  push_abstract: string;
  push_channel: string | null;
  content_link: string | null;
  hotspot: string | null;
  app_name: string;
  date: string;
  brand: string | null;
  device_id: string | null;
  bundle_version: string | null;
  ct: string | null;
  sct: string | null;
  pub_status: number;
  pub_memo: string;
  doc_id?: string;
};

export type DiffCrawlMonitorItem = {
  id: number;
  mid: string;
  doc_id: string;
  pub_status: number;
  pub_memo?: string;
};
