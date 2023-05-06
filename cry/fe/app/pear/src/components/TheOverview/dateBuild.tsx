import React, { FC, useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { Pie, G2 } from '@ant-design/charts';

interface Props {
   data:any,
}
const DateBuild: FC<Props> = (props: Props) => {
	const { data} = props

	const G = G2.getEngine('canvas');
	const config = {
		appendPadding: 10,
		data,
		angleField: 'value',
		colorField: 'type',
		radius: 0.5,
		legend: false,
		label: {
			type: 'spider',
			labelHeight: 40,
			formatter: (data, mappingData) => {
				const group = new G.Group({});
				group.addShape({
					type: 'circle',
					attrs: {
						x: 0,
						y: 0,
						width: 40,
						height: 50,
						r: 5,
						fill: mappingData.color,
					},
				});
				group.addShape({
					type: 'text',
					attrs: {
						x: 10,
						y: 8,
						text: `${data.type}`,
						fill: mappingData.color,
					},
				});
				group.addShape({
					type: 'text',
					attrs: {
						x: 0,
						y: 25,
						text: `${data.value} ${(data.percent * 100).toFixed(1)}%`,
						fill: 'rgba(0, 0, 0, 0.65)',
						fontWeight: 700,
					},
				});
				return group;
			},
		},
		interactions: [
			{
				type: 'element-selected',
			},
			{
				type: 'element-active',
			},
		],
	};
	return <Pie {...config} />
}

export default DateBuild
