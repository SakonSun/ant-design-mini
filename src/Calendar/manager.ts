import dayjs from 'dayjs';
import CALENDAR from './calendar';

class HolidayHandler {
  private holidayList = [];

  constructor(holidayList) {
    this.holidayList = holidayList
  }

  getHoliday(date) {
    const currentDate = dayjs(date);
    const holidayMatch = this.holidayList.filter((data) => {
      if (data.range.length === 1) {
        const rangeStartDay = data.range[0];
        if (!dayjs(rangeStartDay).isSame(currentDate)) {
          return false;
        }
      } else {
        const [startDate, endDate] = data.range.map((item) => dayjs(item));
        if (!startDate.isValid() || !endDate.isValid()) {
          return false;
        }
        if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
          return false;
        }
      }
      return true;
    });
    if (holidayMatch.length <= 0) {
      return null;
    }
    const [targetHoliday] = holidayMatch;
    return {
      type: targetHoliday.type,
      name: targetHoliday.name,
      showHolidayDesc: targetHoliday.day ? dayjs(targetHoliday.day).isSame(currentDate) : false,
      isHolidayStartDay: dayjs(targetHoliday.range[0]).isSame(currentDate),
    };
  }
}

interface ICalendarMultipleChoiceStatus {
  before: String,
  after: String,
  data: Array<any>,
}

export enum ECalendarSelectMode {
  single = "single",
  range = "range"
}

interface ICustomDateTextItem {
  color: string;
  text: string;
  date: string;
}

interface IHolidayItem {
  name: string;
  range: [string, string];
  type: 'holiday' | 'work';
  day: string;
}

class Calendar {
    private startDate: string;
    private endDate: string;
    private disableDates: string[];
    private selectionMode: ECalendarSelectMode;
    private showToday: boolean;
    private customDateList: ICustomDateTextItem[];
    private holidayHandler: HolidayHandler;
    private selectStartDate: string;
    private selectEndDate: string;
    private selectDateList: string[];

    constructor(params: any) {
        let {
            startDate = '',
            endDate = '',
            disableDates = [],
            selectionMode,
            customDateList,
            holidayList = [],
            hideDisableItem,
            selectDate,
            selectRange,
            showlunar
        } = params;

        if (!startDate || !endDate) {
          startDate = dayjs().date(1).format("YYYY-MM-DD")
          endDate = dayjs().add(1, 'M').date(1).subtract(1, 'd').format("YYYY-MM-DD")
        }

        this.showlunar = showlunar;
        this.calendarList = [];
        this.hideDisableItem = hideDisableItem;
        this.holidayHandler = new HolidayHandler(holidayList);
        this.customDateList = customDateList;
        this.showToday = true;
        this.selectionMode = selectionMode;
        // 范围开始
        this.startDate = startDate;
        // 范围结束
        this.endDate = endDate;
        // 禁止日期列表
        this.disableDates = disableDates;

        this.selectEndDate = null;
        this.selectStartDate = null;
        this.selectDateList = []

        if (selectionMode === ECalendarSelectMode.range && selectRange?.length === 2) {
          this.selectStartDate = selectRange[0]
          this.selectEndDate = selectRange[1]
          this.selectDateList = this.getSelectDateList(selectRange[0], selectRange[1]);
        } else if (selectionMode === ECalendarSelectMode.single && selectDate) {
          this.selectStartDate = selectDate
        }
    }

    updateStartEndDate (start, end) {
      if (!start || !end) return
      this.startDate = start
      this.endDate = end
    }

    updateSelectDate (start, end) {
      this.selectStartDate = start;
      this.selectEndDate = end;
      this.selectDateList = this.getSelectDateList(start, end);
    }

    updateDisableDates (dates) {
      this.disableDates = dates
    }

    updateHolidayList (dates) {
      this.holidayHandler = new HolidayHandler(dates);
    }

    updateCustomDateList (dates) {
      this.customDateList = dates
    }

    getSelectDateList (start, end) {
      if (!start || !end) {
        return []
      }
      const list = this.getRangeAllDates(start, end);
      return list;
    }

    /**
     * 获取日期范围内所有日期
     * @param {Object} begin
     * @param {Object} end
     */
    getRangeAllDates(begin, end) {
      begin = dayjs(begin, "YYYY-MM-DD");
      end = dayjs(end, "YYYY-MM-DD");

      const dates = []
      while (!dayjs(begin).isAfter(end)) {
        dates.push(begin.format("YYYY-MM-DD"))
        begin = begin.add(1, 'day');
      }

      return dates;
    }

    calculateCalendarList () {
      const { startDate, endDate } = this;
      const calendarList = [];
      let posDateStr = dayjs(startDate).format('YYYY-MM-01');
      while (!dayjs(posDateStr).isAfter(dayjs(endDate))) {
          this.setDate(posDateStr);
          const entry = {
              monthStartDate: dayjs(posDateStr).format('YYYY-MM-01'),
              monthDisplay: dayjs(posDateStr).format('YYYY年MM月'),
              weeks: this._getWeekList(posDateStr).weeks,
          };
          calendarList.push(entry);
          posDateStr = dayjs(posDateStr)
              .add(1, 'month')
              .format('YYYY-MM-01');
      }

      this.calendarList = calendarList;
    }

    /**
     * 设置日期
     * @param {Object} date
     */
    setDate(date) {
      this._getWeekList(date);
    }

    getDateInfo(date, days = 0, str = 'day') {
        if (!date) {
          date = new Date();
        }
        if (typeof date !== 'object') {
          date = date.replace(/-/g, '/');
        }
        const dd = new Date(date);
        switch (str) {
          case 'day':
            dd.setDate(dd.getDate() + days); // 获取days天后的日期
            break;
          case 'month':
            if (dd.getDate() === 31) {
              dd.setDate(dd.getDate() + days);
            } else {
              dd.setMonth(dd.getMonth() + days); // 获取days天后的日期
            }
            break;
          case 'year':
            dd.setFullYear(dd.getFullYear() + days); // 获取days天后的日期
            break;
        }
        const y = dd.getFullYear();
        const m =
          dd.getMonth() + 1 < 10 ? `0${dd.getMonth() + 1}` : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
        const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate(); // 获取当前几号，不足10补0
        return {
          fullDate: `${y}-${m}-${d}`,
          year: y,
          month: m,
          date: d,
          day: dd.getDay()
        };
    }

    _getWeekList(date) {
        const displayInfo = this.getDateInfo(date);
        const { year, month } = displayInfo;
        const firstDay = new Date(+year, +month - 1, 0).getDay();
        const curMonthDays = new Date(+year, +month, 0).getDate();
        const dates = {
          lastMonthDays: this._getLastMonthDays(firstDay, displayInfo), // 上个月末尾几天
          currentMonthDays: this._currentMonthDays(
            curMonthDays,
            displayInfo
          ), // 本月天数
          nextMonthDays: [], // 下个月开始几天
          weeks: []
        };
        let calender = [];
        let surplus =
          (dates.lastMonthDays.length + dates.currentMonthDays.length) % 7;
        if (surplus) {
          surplus = 7 - surplus;
        }
        dates.nextMonthDays = this._getNextMonthDays(
          surplus,
          displayInfo
        );
        calender = calender.concat(
          dates.lastMonthDays,
          dates.currentMonthDays,
          dates.nextMonthDays
        );
        const weeks = [];
        // 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
        for (let i = 0; i < calender.length; i++) {
          if (i % 7 === 0) {
            weeks[parseInt(`${i / 7}`)] = new Array(7);
          }
          weeks[parseInt(`${i / 7}`)][i % 7] = calender[i];
        }
        weeks.forEach(week => {
          week.forEach((item, i) => {
            if (item.isRangeStart || item.isRangeEnd) {
              item.showBorderRadiusLeft = true
              item.showBorderRadiusRight = true
              return
            }
            if (i == 0 && item.isRangeArea) {
              item.showBorderRadiusLeft = true
            } else if (i == week.length - 1) {
              item.showBorderRadiusRight = true
            } 
          })
        })
        return {
          calender,
          weeks,
          displayMonth: date
        }
    }

    /**
    * 获取上月剩余天数
    */
    _getLastMonthDays(firstDay, full) {
        const dateArr = [];
        for (let i = firstDay; i > 0; i--) {
          const posDate = new Date(full.year, full.month - 1, -i + 1);
          const dateValue =  posDate.getDate();
          const dayValue = posDate.getDay();
          dateArr.push({
              year: full.year,
              date: dateValue,
              month: full.month - 1,
              day: dayValue,
              lunar: this.getlunar(full.year, full.month - 1, dateValue),
              disable: true,
              hide: true
          });
        }
        return dateArr;
    }

    /**
     * 计算阴历日期显示
     */
    getlunar(year, month, date) {
        return CALENDAR.solar2lunar(year, month, date);
    }

    /**
     * 获取本月天数
     */
    _currentMonthDays(daycount, full) {
      const dateArr = [];
      const nowFullDate = this.getDateInfo(undefined).fullDate;
      for (let i = 1; i <= daycount; i++) {
        const posDate = `${full.year}-${full.month < 10 ? full.month : full.month}-${i < 10 ? '0' + i : i}`;
        // 是否今天
        const isToday = nowFullDate === posDate;
        // 日期禁用
        const beforeStartDate = this.startDate ? dayjs(posDate).isBefore(this.startDate) : false;
        const afterEndDate = this.endDate ? dayjs(posDate).isAfter(this.endDate) : false;

        const selectDateList = this.selectDateList;
        let selectIndex = -1;
        let checked = false;
        let isRangeStart = false;
        let isRangeEnd = false
        if (selectDateList && selectDateList.length > 0) {
          selectIndex = selectDateList.findIndex(item =>
            this.dateEqual(item, posDate)
          );
        }
        if (selectIndex !== -1) {
          checked = true;
        }

        if (selectDateList.length > 0) {
          if (selectIndex === 0) {
            isRangeStart = true
          }

          if (selectIndex === selectDateList.length - 1) {
            isRangeEnd = true
          }
        } else if (this.dateEqual(this.selectStartDate, posDate)) {
          isRangeStart = true
        }

        // 判断日期是否在禁用日期列表中
        const disabled = this.disableDates.find((item) => {
          return this.dateEqual(item, posDate)
        });
        const data = {
          fullDate: posDate,
          year: full.year,
          day: dayjs(posDate).day(),
          date: i,
          month: full.month,
          lunar: this.showlunar && this.getlunar(full.year, full.month, i),
          disable: beforeStartDate || afterEndDate || !!disabled,
          hide: false,
          isToday,
          isRangeArea: this.selectionMode === ECalendarSelectMode.range ? checked : false,
          isRangeStart,
          isRangeEnd,
          isSingleSelect: this.selectionMode === ECalendarSelectMode.single && isRangeStart
        };

        if (dayjs(posDate).isBefore(nowFullDate)) {
          data.disable = true
        }

        if (isToday) {
          data.showToday = this.showToday;
        }

        data.holiday = this.holidayHandler.getHoliday(posDate);

        const tagItem = this.customDateList?.find((item) => {
          return dayjs(item.date).format('YYYY-MM-DD') === posDate
        });
      
        if (tagItem) {
          data.tag = tagItem;
        }
        dateArr.push(data);
      }
      return dateArr;
    }

    /**
     * 比较时间是否相等
     */
    dateEqual(before, after) {
      before = dayjs(before, "YYYY-MM-DD")
      after = dayjs(after, "YYYY-MM-DD")
      return before.isSame(after)
    }

    /**
     * 获取下月天数
     */
    _getNextMonthDays(surplus, full) {
      const dateArr = [];
      
      for (let i = 1; i < surplus + 1; i++) {
        const month = Number(full.month) + 1;
        let posDate = dayjs(`${full.year}-${month}-${i}`);
        dateArr.push({
          date: i,
          day: posDate.day(),
          month,
          lunar: this.getlunar(full.year, Number(full.month) + 1, i),
          disable: true,
          hide: true
        });
      }
      return dateArr;
    }
}

export default Calendar;