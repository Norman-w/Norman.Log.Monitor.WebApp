/*



自定义的组件,包含常规的时间区间选择和自定义时间区间选择
当选择自定义时间区间时,会显示一个时间选择器,可以选择开始时间和结束时间

清空按钮会清空时间区间选择



* */

//region 导入antd组件和moment库
import {Dropdown, Menu, DatePicker, Button} from 'antd';
import React, {useState} from 'react';
import moment from 'moment';
const {RangePicker} = DatePicker;
//endregion

const TimeRangeDropdown = ({onChange}) => {
    //region 定义状态
    const [customDateRange, setCustomDateRange] = useState([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    //endregion

    //region 定义事件处理函数(点击菜单项)

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
    //endregion

    //region 定义事件处理函数(选择时间区间)
    const handleDateChange = (dates) => {
        setCustomDateRange(dates);
        onChange(dates);
    };
    //endregion

    //region 构建下拉菜单JSX DOM
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">最近1天</Menu.Item>
            <Menu.Item key="7">最近1周</Menu.Item>
            <Menu.Item key="30">最近1个月</Menu.Item>
            <Menu.Item key="custom">自定义时间段</Menu.Item>
            <Menu.Item key="clear">任意时间</Menu.Item>
        </Menu>
    );
    //endregion

    return (
        <>
            {/*下拉菜单*/}
            <Dropdown overlay={menu} trigger={['click']}>
                <Button style={{width: 150}}>
                    {selectedOption === -1 ? '自定义时间段' : selectedOption ? `最近${selectedOption}天` : '任意时间'}
                </Button>
            </Dropdown>
            {/*动态显示时间选择器*/}
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