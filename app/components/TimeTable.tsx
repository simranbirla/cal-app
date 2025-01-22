import React from 'react'

export interface ITimeTable {
    selectedDate: Date;
}

export default function TimeTable({ selectedDate }: ITimeTable) {
    return (
        <div>
            <p>
                {selectedDate}
            </p>
        </div>
    )
}
