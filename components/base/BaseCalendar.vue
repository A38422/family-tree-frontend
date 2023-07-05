<template>
  <div ref="calendar"></div>
</template>

<script>
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import Vi from '@fullcalendar/core/locales/vi'
import moment from 'moment'
export default {
  props: {
    events: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {

    };
  },

  watch: {
    events: {
      deep: true,
      handler() {
        this.initCalendar()
      }
    }
  },

  mounted() {
    this.initCalendar()
  },

  methods: {
    initCalendar() {
      const todayDate = moment().startOf("day");
      // const YM = todayDate.format("YYYY-MM");
      // const YESTERDAY = todayDate.clone().subtract(1, "day").format("YYYY-MM-DD");
      const TODAY = todayDate.format("YYYY-MM-DD");
      // const TOMORROW = todayDate.clone().add(1, "day").format("YYYY-MM-DD");

      const calendarEl = this.$refs.calendar;
      const calendar = new Calendar(calendarEl, {
        timeZone: 'Asia/Ho_Chi_Minh',
        locale: Vi,

        // themeSystem: 'bootstrap5',

        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        },

        aspectRatio: 3,

        nowIndicator: true,
        now: TODAY + "T09:25:00",
        plugins: [dayGridPlugin, timeGridPlugin],

        views: {
          dayGridMonth: { buttonText: "Tháng" },
          timeGridWeek: { buttonText: "Tuần" },
          timeGridDay: { buttonText: "Ngày" }
        },

        initialView: "dayGridMonth",
        initialDate: TODAY,

        editable: true,
        dayMaxEvents: true,
        navLinks: true,

        events: this.events,

      });

      calendar.render();
    }
  }
};
</script>
