import React from 'react'
import { Steps } from 'antd';
import "./admincp.css";

const { Step } = Steps;

export default function Customers() {
  return (
    <div style={{ padding: 24, background: '#f5f5f5' }}>
      <Steps current={0} progressDot>
        <Step title="1" />
        <Step title="2" />
        <Step title="3" />
        <Step title="4" />
      </Steps>
    </div>
  )
}
