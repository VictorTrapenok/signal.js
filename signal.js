/*
 * signal.js
 * 
 * Copyright (c) 2013, Трапенок Виктор (Trapenok Victor). All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */
 
var signal = function()
{
    /**
     * Подписывает слот на сигнал
     * 
     * Если передать два параметра то они обработаются как  connect( signal_name, slot_function )
     * Если передать три параметра то они обработаются как  connect( slot_name, signal_name, slot_function )
     * 
     * @param slot_name Имя слота
     * @param signal_name Имя сигнала
     * @param slot_function Функция вызваемая при вызове слота, должна иметь следующию сигнатуру function(param, signal_name){}
     * 
     * <code>
     * Пример использования
     * new new signal().emit("catalogControl.OpenObject",{})
     *
     * </code>
     */
    this.connect = function(slot_name, signal_name, slot_function)
    {
        
        if(slot_function === undefined)
        {
            slot_function = signal_name
            signal_name = slot_name
            slot_name = Math.random()+"_"+Math.random()
        }
        
        if (this.slotArray[signal_name] == undefined)
        {
            this.slotArray[signal_name] = new Array()
        }
        this.slotArray[signal_name][slot_name] = slot_function
        if(this.debug) console.log("На прослушивание сигнала " + signal_name + " добавлен слот " + slot_name + "")
    }
    
    
    /**
     * Подписывает слот на сигнал, но позволяет указать численое значение приоритета вызова
     * Подписаные функции вызывабтся в соответсвии с заявленым приоритетом (выше приоритет раньше вызовется). 
     * Если есть две функции с одинаковым приоритетом то они фызываются в соответвии с порядком их добавления.
     * 
     * Функции подписаные чере connect будут вызваны перед функциями подписаными через iconnect
     * 
     * @param priority Приоритет вызова
     * @param signal_name Имя сигнала
     * @param slot_function Функция вызваемая при вызове слота, должна иметь следующию сигнатуру function(param, signal_name){}
     * 
     * <code>
     * Пример использования
     * new new signal().iconnect("catalogControl.OpenObject",30, function(param, signal_name){ console.log([signal_name,param]) })
     * 
     * 
     * new new signal().emit("catalogControl.OpenObject",{})
     *
     * </code>
     */
    this.iconnect = function(signal_name, priority, slot_function)
    { 
        
        if (this.OrderedSlotArray[signal_name] == undefined)
        {
            this.OrderedSlotArray[signal_name] = new Array()
        }
         
        
        this.OrderedSlotArray[signal_name][this.OrderedSlotArray[signal_name].length] = {f:slot_function,priority:priority}
        if(this.debug) console.log("На прослушивание сигнала " + signal_name + " добавлен слот " + this.OrderedSlotArray[signal_name].length-1 + " с приоритетом "+priority)
    }

    /**
     * Отписывает слот slot_name от сигнала signal_name
     */
    this.disconnect = function(slot_name, signal_name)
    {
        if (this.slotArray[signal_name] == undefined)
        {
            this.slotArray[signal_name] = new Array()
        }
        
        if (this.slotArray[signal_name][slot_name] != undefined)
        {
            delete this.slotArray[signal_name][slot_name]
        }
    }

    /**
     * Вызывает слоты подписаные на сигнал signal_name и каждому из них передаёт аруметы signal_name - имя вызвавшего сигнала, и param - объект с параметрами для слота)
     * В добавок ретранслирует сигнал в дочернии iframe если они есть и в родительское окно если оно есть
     * @param signal_name Имя сигнала
     * @param param Параметры переданые слоту при вызове в втором аргументе
     * @param excluded_window служебный аргумент, указывает на окно в которое не надо ркетранслировать сообщение
     */
    this.emit = function(signal_name, param, excluded_window)
    {
        if (this.slotArray[signal_name] == undefined)
        {
            if(this.debug) console.log("На сигнал " + signal_name + " нет подписчиков")
        }
        else
        {
            if(this.debug) console.log("Сигнал " + signal_name + " подписаны слоты")
            for (var slot in this.slotArray[signal_name])
            {
                this.slotArray[signal_name][slot](param,signal_name)
            }
            
        }
        
        if(this.OrderedSlotArray[signal_name])
        {
            if(this.debug) console.log("Сигнал " + signal_name + " подписаны сортируемые слоты")
            this.OrderedSlotArray[signal_name].sort(function(a,b){return b.priority-a.priority;})
            for (var slot in this.OrderedSlotArray[signal_name])
            {
                this.OrderedSlotArray[signal_name][slot].f(param,signal_name)
            }
        } 
        
        var frames = document.getElementsByTagName("iframe");
        if(frames)
        {
            for(var i = 0; i< frames.length; i++)
            { 
                if(frames[i].contentWindow !== excluded_window)
                { 
                    if(this.debug) console.log("Сигнал " + signal_name + " отправлен в фреим " + i)
                    frames[i].contentWindow.postMessage({
                        name:signal_name,
                        param:param,
                        author:'signal.js',
                        author_id:this.custom_id
                    },"*");
                }
            }
        }
        
        
        if( window.parent !== window && excluded_window !== window.parent )
        {
            if(this.debug) console.log("Сигнал " + signal_name + " отправлен в роидительское окно... " )
            window.parent.postMessage({
                        name:signal_name,
                        param:param,
                        author:'signal.js',
                        author_id:this.custom_id
                    },"*");
        }
        
        
    }
     
    /*
     *  генерация события будут оповещены и соседние вкладки
     *  @eName string - имя события 
     *  использование .emit('любое название события', [ Параметры события ])
     */
    this.send_emit = function (signal_name, param) 
    {
        this.emit(signal_name, param)

        if(window['localStorage'] !==undefined  )
        {
            var curent_custom_id = Math.random()+"_"+Math.random()+"_"+Math.random()+"_"+Math.random()+"_"+Math.random()

            last_custom_id = curent_custom_id.replace(/0\./img,"")
            window['localStorage']['CustomUserSignal_StorageEmit']= JSON.stringify({name:eName, custom_id:curent_custom_id, param:param}); 
        }
    }

     

}

signal.prototype.OrderedSlotArray = new Array()
signal.prototype.slotArray = new Array()
signal.prototype.debug = false
signal.prototype.custom_id = Math.random()+"_"+Math.random()+"_"+Math.random()+"_"+Math.random()
signal.prototype.init = false

function storageEventHandler(e)
{
    //console.log( e.newValue )
    var data = JSON.parse(e.newValue);

    if(this.debug) console.log( data.name )
    //console.log( data.arguments )
    new signal().emit( data.name, data.param )
}

function messageEventHandler(e)
{ 
    if(e.data.author == 'signal.js' && e.data.author_id !== signal.prototype.custom_id)
    {  
        if(e.source !== window)
        {
            if(this.debug) console.log( ["messageEventHandler", document.title, e] ) 
            new signal().emit( e.data.name, e.data.param, e.source)
        }
        
        if( window.parent.signal.prototype.custom_id !== signal.prototype.custom_id )// Определяет что родительское окно не равно текущему окну
        {
            if(this.debug) console.log( ["messageEventHandler", "ретрансляция в родительское окно"] ) 
            window.parent.postMessage(e.data,"*");
        }
    }
}

if(!signal.prototype.init)
{
    signal.prototype.init = true
    if( window.addEventListener )
    {
        window.addEventListener('storage', storageEventHandler, false);
        window.addEventListener("message", messageEventHandler,false);
    }
    else
    {
        document.attachEvent('onstorage', storageEventHandler );
        window.attachEvent("onmessage", messageEventHandler);
    }
}

