(function () {
  window.onload = function () {
    var tp = new bwidget.timepicker('#tp', {
      width: '300px',
      height: '40px',
      align: 'center',
      format: 'hh(99):mm:ss',
      second: 1000,
      disabled: false,
      onInput(obj) {
        console.log(obj.preValue + ' - ' + obj.newValue)
      },
      onValueChanged(obj) {
        console.log(obj.preValue + ' - ' + obj.newValue)
      }
    })
    document.querySelector('#disabled').addEventListener('click', function () {
      tp.disabled = !tp.disabled
    })
    document.querySelector('#getsecond').addEventListener('click', function () {
      document.querySelector('#getsecondtext').value = tp.second
    })
    document.querySelector('#setsecond').addEventListener('click', function () {
      tp.second = +document.querySelector('#setsecondtext').value
    })
    document.querySelector('#setwidth').addEventListener('click', function () {
      tp.width = document.querySelector('#setwidthtext').value
    })
    document.querySelector('#setheight').addEventListener('click', function () {
      tp.height = document.querySelector('#setheighttext').value
    })
    document.querySelector('#setalign').addEventListener('click', function () {
      tp.align = document.querySelector('#setaligntext').value
    })
  }
}())

