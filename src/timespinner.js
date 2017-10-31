/**
 * better-widget TimeSpinner 1.0.0 
 * License: MIT
 */

var hmsReg = /^hh(\((\d+)\))?:mm:ss$/
var hmReg = /^hh(\((\d+)\))?:mm$/
var msReg = /^mm(\((\d+)\))?:ss$/

/**
 * @description
 * @param {string} selector dom query selector.
 * @param {object} options initial options.
 */
function TimeSpinner(selector, options) {
  var instance = this
  var formatExprShort = /^(\d+):(\d+)$/
  var formatExprLong = /^(\d+):(\d+):(\d+)$/
  var element = document.querySelector(selector)
  var widgetProp = {
    element: element,
    second: 0,
    format: 'hh(23):mm:ss', // 'mm(59):ss' , 'hh():mm'
    type: 'hh:mm:ss',
    text: '00:00:00',
    width: '100%',
    height: '100%',
    align: 'left',
    selection: 0,
    disabled: false,
    onInput: function () { },
    onValueChanged: function () { }
  }
  generateHtml()
  setProperties()
  setOptions(options)
  bindEvent()

  return instance

  //////////////////////////////////
  // function
  //////////////////////////////////
  function generateHtml() {
    element.innerHTML =
      '<div class="bw-timespinner">'
      + '<div class="input-wrap">'
      + '<input class="input" type="text" onpaste="return false;" oncontextmenu="return false;" ondrop="return false;" >'
      + '</div>'
      + '<div class="arrow-wrap">'
      + '<div class="arrow up">'
      + '<i></i>'
      + '</div>'
      + '<div class="arrow down">'
      + '<i></i>'
      + '</div>'
      + '</div>'
      + '</div>'
    element.classList.add('bw-timespinner-wrap')
  }

  function setProperties() {
    Object.defineProperties(instance, {
      element: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.element
        }
      },
      second: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.second
        },
        set: function (param) {
          if (isInteger(param)) {
            // var preV = widgetProp.second
            var value = this.second2Text(param), matches
            widgetProp.second = param
            widgetProp.element.querySelector('.input').value = value

            if (widgetProp.type === 'hh:mm:ss') {
              widgetProp.colons = [widgetProp.max.toString().length, widgetProp.max.toString().length + 3]
              matches = value.match(formatExprLong)
              widgetProp.partial = [+matches[1], +matches[2], +matches[3]]
            } else {
              widgetProp.colons = [widgetProp.max.toString().length]
              matches = value.match(formatExprShort)
              widgetProp.partial = [+matches[1], +matches[2]]
            }
            // widgetProp.onValueChanged({ preValue: preV, newValue: param })
          } else {
            throw new Error('second must be a integer')
          }

        }
      },
      width: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.width
        },
        set: function (param) {
          if (isInteger(param)) {
            widgetProp.width = param + 'px'
          } else if (isString(param)) {
            widgetProp.width = param
          } else {
            throw new Error('width is not valid')
          }
          widgetProp.element.style.width = param
        }
      },
      height: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.height
        },
        set: function (param) {
          if (isInteger(param)) {
            widgetProp.height = param + 'px'
          } else if (isString(param)) {
            widgetProp.height = param
          } else {
            throw new Error('height is not valid')
          }
          widgetProp.element.style.height = param
        }
      },
      align: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.align
        },
        set: function (param) {
          if (isString(param) && ['left', 'center', 'right'].indexOf(param.toLowerCase()) > -1) {
            widgetProp.align = param.toLowerCase()
            widgetProp.element.querySelector('.input').style.textAlign = param.toLowerCase()
          } else {
            throw new Error('align is not valid')
          }
        }
      },
      disabled: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.disabled
        },
        set: function (param) {
          widgetProp.disabled = !!param
          if (param) {
            this.element.querySelector('.bw-timespinner').classList.add('bw-timespinner-disabled')
            this.element.querySelector('.input').disabled = true
            this.element.querySelector('.arrow.up').removeEventListener('click', onClick)
            this.element.querySelector('.arrow.down').removeEventListener('click', onClick)
          } else {
            this.element.querySelector('.bw-timespinner').classList.remove('bw-timespinner-disabled')
            this.element.querySelector('.input').removeAttribute('disabled')
            this.element.querySelector('.arrow.up').addEventListener('click', onClick)
            this.element.querySelector('.arrow.down').addEventListener('click', onClick)
          }
        }
      },
      format: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.format
        }
      },
      max: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.max
        }
      },
      onInput: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.onInput
        },
        set: function (param) {
          if (isFunction(param)) {
            widgetProp.onInput = param
          } else {
            throw new Error('onInput is not a function')
          }
        }
      },
      onValueChanged: {
        configurable: false,
        enumerable: true,
        get: function () {
          return widgetProp.onValueChanged
        },
        set: function (param) {
          if (isFunction(param)) {
            widgetProp.onValueChanged = param
          } else {
            throw new Error('onValueChanged is not a function')
          }
        }
      }
    })
  }

  function setOptions(opt) {
    var matches
    if (isString(opt.format)) {
      if (hmsReg.test(opt.format)) {
        matches = opt.format.match(hmsReg)
        if (matches[2] == null) {
          widgetProp.max = 23
          opt.format = 'hh(23):mm:ss'
        } else {
          widgetProp.max = +matches[2]
        }
        widgetProp.format = opt.format
        widgetProp.type = 'hh:mm:ss'
      } else if (hmReg.test(opt.format)) {
        matches = opt.format.match(hmReg)
        if (matches[2] == null) {
          widgetProp.max = 23
          opt.format = 'hh(23):mm'
        } else {
          widgetProp.max = +matches[2]
        }
        widgetProp.format = opt.format
        widgetProp.type = 'hh:mm'
      } else if (msReg.test(opt.format)) {
        matches = opt.format.match(msReg)
        if (matches[2] == null) {
          widgetProp.max = 59
          opt.format = 'mm(59):ss'
        } else {
          widgetProp.max = +matches[2]
        }
        widgetProp.format = opt.format
        widgetProp.type = 'mm:ss'
      } else {
        throw new Error('format is not valid')
      }
    }
    if (isInteger(opt.second)) {
      instance.second = opt.second
    }
    if (isInteger(opt.width) || isString(opt.width)) {
      instance.width = opt.width
    }
    if (isInteger(opt.height) || isString(opt.height)) {
      instance.height = opt.height
    }
    if (isString(opt.align)) {
      instance.align = opt.align
    }
    instance.disabled = !!opt.disabled
    if (isFunction(opt.onInput)) {
      instance.onInput = opt.onInput
    }
    if (isFunction(opt.onValueChanged)) {
      instance.onValueChanged = opt.onValueChanged
    }
  }

  function bindEvent() {
    var inputEle = widgetProp.element.querySelector('.input')

    inputEle.addEventListener('mouseup', onMouseup)
    inputEle.addEventListener('keydown', onKeydown)
    inputEle.addEventListener('keyup', onKeyup)

    inputEle.addEventListener('input', onInput)
    widgetProp.element.querySelector('.arrow.up').addEventListener('click', onClick)
    widgetProp.element.querySelector('.arrow.down').addEventListener('click', onClick)
  }
  function changeOne(type) {
    var text, oldV, newV
    oldV = widgetProp.partial[widgetProp.selection]
    if (type === 'up') {
      if (oldV >= (widgetProp.selection === 0 ? widgetProp.max : 59)) {
        newV = 0
      } else {
        newV = oldV + 1
      }
    } else {
      if (oldV <= 0) {
        newV = widgetProp.selection === 0 ? widgetProp.max : 59
      } else {
        newV = oldV - 1
      }
    }
    widgetProp.partial[widgetProp.selection] = newV
    text = widgetProp.partial.join(':')
    instance.second = instance.text2Second(text)
  }
  function inputOneKey(key) {
    var text, newV
    newV = widgetProp.partial[widgetProp.selection] + key
    if (+newV > (widgetProp.selection === 0 ? widgetProp.max : 59)) {
      newV = key
    }
    widgetProp.partial[widgetProp.selection] = +newV
    text = widgetProp.partial.join(':')
    instance.second = instance.text2Second(text)
  }
  function focusSelection() {
    var inputEle = widgetProp.element.querySelector('.input')
    var colons = widgetProp.colons
    if (widgetProp.selection === 0) {
      createInputSelection(inputEle, 0, colons[0])
    } else if (widgetProp.selection === 1) {
      createInputSelection(inputEle, colons[0] + 1, 2)
    } else {
      createInputSelection(inputEle, colons[1] + 1, 2)
    }
  }

  function onMouseup(event) {
    var inputEle = widgetProp.element.querySelector('.input')
    event.preventDefault()
    var pos = getCursorPosition(inputEle)
    if (widgetProp.type === 'hh:mm:ss') {
      if (pos <= widgetProp.colons[0]) {
        widgetProp.selection = 0
      } else if (pos > widgetProp.colons[0] && pos <= widgetProp.colons[1]) {
        widgetProp.selection = 1
      } else {
        widgetProp.selection = 2
      }
    } else {
      widgetProp.selection = pos <= widgetProp.colons[0] ? 0 : 1
    }
    focusSelection()
  }

  /**
   * input事件主要处理中文输入法状态下的输入，英文输入通过keydown事件处理
   * @param {*} event 
   */
  function onInput(event) {
    var inputEle = widgetProp.element.querySelector('.input'), valueGroupTemp, newChar, preV
    event.preventDefault()
    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      // 火狐浏览器中文输入法下，输入会触发多次，判断isComposing是否为true，表示正在输入，最后一次为false，
      // 输入数字也会触发两次，只处理最后一次
      // chrome下也会触发多次，但是输入数字只会触发一次，这里的判断主要为了处理输入数字时的问题，输入字母用下面的正则表达式判断
      if (event.isComposing) {
        return false
      }
    }
    if (widgetProp.type === 'hh:mm:ss') {
      if (formatExprLong.test(inputEle.value)) {
        valueGroupTemp = inputEle.value.match(formatExprLong)
        if (widgetProp.selection === 0) {
          newChar = valueGroupTemp[1][0]
        } else if (widgetProp.selection === 1) {
          newChar = valueGroupTemp[2][0]
        } else {
          newChar = valueGroupTemp[3][0]
        }
        preV = widgetProp.second
        inputOneKey(newChar)
        widgetProp.onInput({ preValue: preV, newValue: widgetProp.second })
      } else {
        instance.second = widgetProp.second
      }
    } else {
      if (formatExprShort.test(inputEle.value)) {
        valueGroupTemp = inputEle.value.match(formatExprShort)
        if (widgetProp.selection === 0) {
          newChar = valueGroupTemp[1][0]
        } else {
          newChar = valueGroupTemp[2][0]
        }
        preV = widgetProp.second
        inputOneKey(newChar)
        widgetProp.onInput({ preValue: preV, newValue: widgetProp.second })
      } else {
        instance.second = widgetProp.second
      }
    }
    setTimeout(function() {
      focusSelection()
    }, 0)
  }

  function onKeydown(event) {
    var preV
    var keyCode = {
      left: 37,
      up: 38,
      right: 39,
      down: 40
    }
    event.preventDefault()
    if (event.keyCode === keyCode.left || event.keyCode === keyCode.right) {
      if (widgetProp.type === 'hh:mm:ss') {
        if (widgetProp.selection === 0) {
          widgetProp.selection = event.keyCode === keyCode.left ? 2 : 1
        } else if (widgetProp.selection === 1) {
          widgetProp.selection = event.keyCode === keyCode.left ? 0 : 2
        } else {
          widgetProp.selection = event.keyCode === keyCode.left ? 1 : 0
        }
      } else {
        widgetProp.selection = widgetProp.selection === 0 ? 1 : 0
      }

    } else if (event.keyCode === keyCode.up || event.keyCode === keyCode.down) {
      preV = widgetProp.second
      changeOne(event.keyCode === keyCode.up ? 'up' : 'down')
      widgetProp.onInput({ preValue: preV, newValue: widgetProp.second })
    } else {
      var keyArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      if (keyArr.indexOf(event.key) !== -1) {
        preV = widgetProp.second
        inputOneKey(event.key)
        widgetProp.onInput({ preValue: preV, newValue: widgetProp.second })
      } else {
        instance.second = widgetProp.second
      }
    }
    focusSelection()
  }
  function onKeyup() {
    focusSelection()
  }
  function onClick(event) {
    if (widgetProp.disabled) {
      return false
    }
    var preV = widgetProp.second
    changeOne(event.currentTarget.classList.contains('up') ? 'up' : 'down')
    widgetProp.onInput({ preValue: preV, newValue: widgetProp.second })
  }
}

TimeSpinner.prototype.text2Second = function (arg) {
  var formatExpr1 = /^(\d+):(\d+)$/, formatExpr2 = /^(\d+):(\d+):(\d+)$/
  var matches
  if (!isString(arg)) {
    throw new Error('arg must be string')
  }
  if (formatExpr2.test(arg)) {
    matches = arg.match(formatExpr2)
    if (+matches[1] > this.max) {
      throw new Error('first exceeds the maximum')
    }
    if (+matches[2] > 59) {
      throw new Error('second exceeds the maximum')
    }
    if (+matches[3] > 59) {
      throw new Error('third exceeds the maximum')
    }
    return +matches[3] + (+matches[2] + +matches[1] * 60) * 60
  } else if (formatExpr1.test(arg)) {
    matches = arg.match(formatExpr1)
    if (+matches[1] > this.max) {
      throw new Error('first value exceeds the maximum')
    }
    if (+matches[2] > 59) {
      throw new Error('second value exceeds the maximum')
    }
    return +matches[2] + +matches[1] * 60
  } else {
    throw new Error('arg format is not valid')
  }

}
TimeSpinner.prototype.second2Text = function (num) {
  var m1, m2, m3
  if (num < 0) {
    throw new Error('arg can not be negative')
  }
  if (hmsReg.test(this.format)) {
    m3 = num % 60
    m2 = ((num - m3) / 60) % 60
    m1 = parseInt(num / 3600)
    if (m1 > this.max) {
      throw new Error('hour exceeds the maximum')
    }
    return [prefixInteger(m1, this.max.toString().length), prefixInteger(m2, 2), prefixInteger(m3, 2)].join(':')
  } else if (hmReg.test(this.format) || msReg.test(this.format)) {
    m2 = num % 60
    m1 = parseInt(num / 60)
    if (m1 > this.max) {
      throw new Error('exceeds the maximum')
    }
    return [prefixInteger(m1, this.max.toString().length), prefixInteger(m2, 2)].join(':')
  }
}

function getCursorPosition(element) {
  var pos = 0
  if ('selectionStart' in element) {
    pos = element.selectionStart
  } else if ('selection' in document) {
    element.focus()
    var Sel = document.selection.createRange()
    var SelLength = document.selection.createRange().text.length
    Sel.moveStart('character', -element.value.length)
    pos = Sel.text.length - SelLength
  }
  return pos
}

function createInputSelection(element, start, count) {
  if (element.setSelectionRange) {
    element.setSelectionRange(start, start + count)
  } else if (element.createTextRange) {
    var selRange = element.createTextRange()
    selRange.collapse(true)
    selRange.moveStart('character', start)
    selRange.moveEnd('character', start + count)
    selRange.select()
  } else if (element.selectionStart) {
    element.selectionStart = start
    element.selectionEnd = start + count
  }
  element.focus()
}

function isString(arg) {
  return Object.prototype.toString.call(arg) === '[object String]'
}

function isInteger(arg) {
  return Object.prototype.toString.call(arg) === '[object Number]' && parseInt(arg) === arg
}

function isFunction(arg) {
  return Object.prototype.toString.call(arg) === '[object Function]'
}

function prefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n)
}

export default TimeSpinner