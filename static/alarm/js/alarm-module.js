const alarmService = (()=> {

    const alarmList = async (page, callback) => {
        const response = await fetch(`/alarm/show/main/${page}`);
        const alarms = await response.json();
        if (callback) {
            return callback(alarms)
        };
        return alarms

    };

    const removeAlarm = async (alarm_id) => {
        await fetch(`/alarm/update/`, {
            method: 'patch',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({alarm_id: alarm_id})
        });
    }

    const removeAll = async (page) => {
        await fetch(`/alarm/remove/`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({page: page})
        });
    }


    return {alarmList:alarmList, removeAlarm:removeAlarm, removeAll:removeAll}
})()