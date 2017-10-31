# bwidget-timespinner
---

  这是一个使用原生javascript开发的时间微调控件，可以分别调节时分秒，并且兼容了中文输入法，限制输入非数字。兼容IE9以上浏览器。
  
  ![此处输入图片的描述][1]

## 安装

1. npm安装

  ```
  npm install bwidget-timespinner --save
  ```
  
2. 浏览器直接引用 

  ```
  <!-- style -->
  <link rel="stylesheet" type="text/css" href="css/bwidget.timespinner.css">
  <!-- script -->
  <script src="js/bwidget.timespinner.js"></script>
  ```

  可以通过github进行下载：[https://github.com/betterliyu/timespinner][2]
  
## 使用

1. 初始化

    - 模块化开发

    ```
    import 'node_modules/bwidget-timespinner/dist/css/bwidget.timespinner.css'
    import TimeSpinner from 'bwidget-timespinner'
      
    var timespinner = new TimeSpinner('#timespinner', {
      width: 300,
      height: 40,
      align: 'center',
      format: 'hh:mm:ss',
      second: 1000,
      disabled: false,
      onInput (obj) {
        console.log(obj.preValue + ' - ' + obj.newValue)
      },
      onValueChanged (obj) {
        console.log(obj.preValue + ' - ' + obj.newValue)
      }
    })
    ```
    
    - 全局变量方式

    ``` 
    // bwidget是全局变量
    var timespinner = new bwidget.timespinner('#timespinner', {})
    ``` 

 
2. 获取和设置
    
 - 获取属性： `var value = instance.prop`
 - 设置属性： `instance.prop = value`

## 配置说明

### **align**

> Type: `String`
> Default Value: `'left'`  
> Accept Values: `css text-align value`

获取或设置控件的内容水平对齐方式。

```
var instance = new TimePicker('#tp', {})
// set
instance.align = 'right'
// get
var textAlign = instance.align
```

### **disabled**

> Type: `Boolean`
> Default Value: `false`

设置或获取控件是否可用。

```
var instance = new TimePicker('#tp', {})
// set
instance.disabled = true
// get
var disabled = instance.disabled
```

### **element**

> Type: `Element`
`ReadOnly`

获取控件对应的DOM Element对象。

```
var instance = new TimePicker('#tp', {})
// get
var element = instance.element
```

### **format**

> Type: `String`
> Default Value: `'hh:mm:ss'`
> Accepted Values: `'hh:mm:ss'` | `'hh:mm'` | `'mm:ss'` | `'hh(max):mm:ss'` | `'hh(max):mm'` | `'mm(max):ss'`

设置时间的格式。只能在初始化时设置。分为两种格式，不包含数字，表示采用默认大小，包含数字，表示设置最大小时或分钟数。最大值可以是任意数字。如果未指定则小时最大值为23(`'hh(23):mm:ss'`,`'hh(23):mm'`)，分钟最大值为59(`'mm(59):ss'`)。

```
var instance = new TimePicker('#tp', {
  // set
  format: 'hh(99):mm:ss'
})
// get
var format = instance.format
```

### **height**

> Type: `String` | `Number`
> Default Value: `'100%'`
> Accepted Values: `css value` | `number`

设置或获取控件的高度。

```
var instance = new TimePicker('#tp', {})
// set
instance.height = 200
// get
var height = instance.height
```


### **second**

> Type: `Integer`
> Default Value: `0`

设置或获取时间的值。不同格式的时间都通过设置的秒进行转换。

```
var instance = new TimePicker('#tp', {})
// set
instance.second = 1000
// get
var sec = instance.second
```
### **width**

> Type: `String` | `Number`
> Default Value: `'100%'`
> Accepted Values: `css value` | `number`

设置或获取控件的宽度。

```
var instance = new TimePicker('#tp', {})
// set
instance.width = 200
// get
var width = instance.width
```




## 事件

### **input**
  
> Type: `function`
> Arguments: `[Object] { preValue, newValue }`

在控件的值被输入或点击上下箭头修改时触发。随后会触发`onValueChanged`事件

```
var instance = new TimePicker('#tp', {
  onInput: function(arg) { }
})
```

### **valueChanged**

> Type: `function`
> Arguments: `[Object] { preValue, newValue }`

在控件的second值发生变化时触发。

```
var instance = new TimePicker('#tp', {
  onValueChanged: function(arg) { }
})
```


## 方法

### **text2Second**

> Arguments: `Time Format String(控件定义的格式)`
> Return Value: `second`

将时间字符串转换为对应的秒数。
    
### **second2Text**

> Arguments: `second`
> Return Value: `Time Format String(控件定义的格式)`

将秒数转换为对应的时间字符串。

    
  [1]: http://ouvy2mvib.bkt.clouddn.com/2017-10-31_15h36_05.png
  [2]: https://github.com/betterliyu/timespinner
  [3]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-align