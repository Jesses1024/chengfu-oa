import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';

class DateTimePicker extends PureComponent {
  render() {
    return (
      <DatePicker
        showTime={{ format: 'HH:mm', minuteStep: 5 }}
        style={{ width: '100%' }}
        format="YYYY-MM-DD HH:mm"
        placeholder="请选择"
        {...this.props}
      />
    );
  }
}

export default DateTimePicker;
