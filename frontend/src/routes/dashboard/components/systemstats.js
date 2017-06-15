import React from 'react';
import { Row, Col, Card } from 'antd';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Label } from 'recharts';
import styles from './cpu.less';

function Cpu({ total }) {

  const colors = ['#2ca02c', '#fff'];
  const data02 = [
    { name: 'used', value: 50 },
    { name: 'free', value: 1 },
  ];
  const cpuTotalPercent = `${total}%`;

  return (
    <Row gutter={2}>
      <Col span={12}>
        <Card className={styles.numberCard} bordered={false} bodyStyle={{ padding: 0 }}>
          <p>CPU</p>
          <PieChart width={150} height={150}>
            <Pie
              data={data02}
              dataKey="value"
              cx={60}
              cy={60}
              startAngle={90}
              endAngle={-270}
              innerRadius={30}
              outerRadius={60}
            >
              {
                data02.map((entry, index) => (
                  <Cell key={`slice-${index}`} fill={colors[index % 10]}/>
                ))
              }
              <Label width={50} position="center">
                {cpuTotalPercent}
              </Label>
            </Pie>
          </PieChart>
        </Card>
      </Col>
      <Col span={12}>
        <Card className={styles.numberCard} bordered={false} bodyStyle={{ padding: 0 }}>
          <p>Mem</p>
          <PieChart width={150} height={150}>
            <Pie
              data={data02}
              dataKey="value"
              cx={60}
              cy={60}
              startAngle={90}
              endAngle={-270}
              innerRadius={30}
              outerRadius={60}
            >
              {
                data02.map((entry, index) => (
                  <Cell key={`slice-${index}`} fill={colors[index % 10]}/>
                ))
              }
              <Label width={50} position="center">
                {cpuTotalPercent}
              </Label>
            </Pie>
          </PieChart>
        </Card>
      </Col>
    </Row>
  );
}

Cpu.propTypes = {
  total: PropTypes.number,
};

export default Cpu;
