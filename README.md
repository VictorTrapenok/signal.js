Представляет функционал сигналов и слотов, позволяет обмениватся сообщениями между разными вкладками одного браузера в пределах одного домена.
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
