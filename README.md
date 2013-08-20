Представляет функционал сигналов и слотов, позволяет обмениватся сообщениями между разными вкладками одного браузера в пределах одного домена и ещё отправляет сигналы в frame/iframe расположеные на странице и в родительский frame/iframe с помощью html 5 post message Api
<br>

Выключает режим отлатки
<pre>
 signal.prototype.debug = false
</pre>
 
<br>
Включает режим отлатки
<pre>
 signal.prototype.debug = true
</pre>
 
<br>
 Подписываемся на сигнал
<pre>
new signal().connect("site-add-tools",function(param){
    console.log(["site-add-tools-"+param.id,param]);
    $("#"+param.holder).html( $("#"+param.holder).html() + "<button onclick=\"Tpl_ConfigForm("+param.id+");\" >Шаблоны</button>")
})
</pre>

<br>
Испускаем сигнал
<pre>
new signal().emit("site-groups-add-tools",{
              id:"0",
              holder:"group0_tools",
              name:"0"
             });
</pre>

<br>
<br>
Подписывает слот на сигнал, но позволяет указать численое значение приоритета вызова. Подписаные функции вызываются в соответсвии с заявленым приоритетом (выше приоритет раньше вызовется). Если есть две функции с одинаковым приоритетом то они фызываются в соответвии с порядком их добавления. Функции подписаные чере connect будут вызваны перед функциями подписаными через iconnect
<br>

priority Приоритет вызова
<br>
signal_name Имя сигнала
<br>
slot_function Функция вызваемая при вызове слота, должна иметь следующию сигнатуру function(param, signal_name){}
<br>

<pre>
new new signal().iconnect("catalogControl.OpenObject",30, function(param, signal_name){ console.log([signal_name,param]) })
</pre>

