import React from "react";
import { Badge, Tag } from "antd";

export const NotiTotal: React.FC<{ total: number }> = ({ total }) => {
	return (
		<div className="notification-total">
			<Badge count={total} />
			<span>当前监控到新的push</span>
		</div>
	);
};

export const NotiMessage: React.FC<{ title: string }> = ({ title }) => {
	return (
		<div className="notification-message">
			<span className="label">标题</span>
			<p className="content">{title}</p>
		</div>
	);
};

export const NotiDescription: React.FC<{ summary: string; sct?: string; app?: string; date?: string }> = ({ summary, sct, app, date }) => {
	return (
		<div className="notification-descripton">
			<span className="label">摘要</span>
			<div className="content">
				<p>{summary}</p>
				<div>
					{app && <Tag color="#2db7f5">{app}</Tag>}
					{date && <Tag color="#87d068">{date}</Tag>}
				</div>
			</div>
		</div>
	);
};
