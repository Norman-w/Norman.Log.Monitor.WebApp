import {Dropdown, Menu, DatePicker, Button} from 'antd';
import React, {useState} from 'react';
import moment from 'moment';

const {RangePicker} = DatePicker;

const TimeRangeDropdown = ({onChange}) => {
    const [customDateRange, setCustomDateRange] = useState([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleMenuClick = (e) => {
        if (e.key === 'custom') {
            setSelectedOption(-1);
        } else if (e.key === 'clear') {
            setSelectedOption(null);
            setCustomDateRange([]);
            onChange([]);
        } else {
            const days = parseInt(e.key, 10);
            const start = moment().subtract(days, 'days');
            const end = moment();
            setSelectedOption(days);
            setCustomDateRange([start, end]);
            onChange([start, end]);
        }
    };

    const handleDateChange = (dates) => {
        setCustomDateRange(dates);
        onChange(dates);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">最近1天</Menu.Item>
            <Menu.Item key="7">最近1周</Menu.Item>
            <Menu.Item key="30">最近1个月</Menu.Item>
            <Menu.Item key="custom">自定义时间段</Menu.Item>
            <Menu.Item key="clear">任意时间</Menu.Item>
        </Menu>
    );

    return (
        <>
            <Dropdown overlay={menu} trigger={['click']}>
                <Button style={{width: 150}}>
                    {selectedOption === -1 ? '自定义时间段' : selectedOption ? `最近${selectedOption}天` : '任意时间'}
                </Button>
            </Dropdown>
            {selectedOption === -1 && (
                <RangePicker
                    value={customDateRange}
                    onChange={handleDateChange}
                    style={{marginTop: 10}}
                />
            )}
        </>
    );
};

export default TimeRangeDropdown;