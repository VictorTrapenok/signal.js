Представляет функционал сигналов и слотов, позволяет обмениватся сообщениями между разными вкладками одного браузера в пределах одного домена.


Выключает режим отлатки
 signal.prototype.debug = false
 
Включает режим отлатки
 signal.prototype.debug = true
 
 Подписываемся на сигнал
new signal().connect("site-add-tools",function(param){
    console.log(["site-add-tools-"+param.id,param]);
    $("#"+param.holder).html( $("#"+param.holder).html() + "<button onclick=\"Tpl_ConfigForm("+param.id+");\" >Шаблоны</button>")
})

Испускаем сигнал
new signal().emit("site-groups-add-tools",{
              id:"0",
              holder:"group0_tools",
              name:"0"
             });
