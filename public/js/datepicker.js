const startPickerEl = document.querySelector('#startDatePicker');
const endPickerEl = document.querySelector('#endDatePicker');
const reserveBtnEl = document.querySelector('.booking-btn');

const getBookings = async () => {
    const pathname = window.location.pathname;
    const id = pathname.slice(pathname.lastIndexOf('/') + 1);
    const res = await fetch(`/api/listings/${id}/booking`)
    const bookings = await res.json();
    return bookings;
}

const getDisabledDates = async () => {
    bookings = await getBookings()
    const disabledDates = bookings.flatMap(booking => {
        return [{ 
            from:booking.date.checkin, 
            to: booking.date.checkout 
        }]
    })
    return disabledDates;
}

const calendar = async () => {
    const disabledDates = await getDisabledDates();
    const date = new Date()
    const startPicker = flatpickr(startPickerEl, {
        mode: 'range',
        altFormat: 'D F j, Y',
        altInput: true,
        dateFormat: 'Y-m-d H:i',
        allowInput: true,
        disable: disabledDates,
        minDate: 'today',
        onClose: function (selectedDates, dateStr, instance) {
            startPicker.setDate(selectedDates[0]);
            selectedDates[1] && endPicker.setDate(selectedDates[1]);
        },
        onOpen: function (selectedDates, dateStr, instance) {
            if (selectedDates.length) {
                selectedDates.push(endPicker.selectedDates[0])
                instance.setDate(selectedDates);
            }
        },
    });
    
    const endPicker = flatpickr(endPickerEl, {
        altFormat: 'D F j, Y',
        altInput: true,
        dateFormat: 'Y-m-d H:i',
        position: 'below',
        allowInput: true,
        onOpen: function (selectedDates, dateStr, instance) {
            instance.close();
            startPicker.open();
        }
    });
}

calendar();




