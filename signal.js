
var signal = function()
{
    /**
     * Подписывает слот на сигнал
     * @param slot_name Имя слота
     * @param signal_name Имя сигнала
     * @param slot_function Функция вызваемая при вызове слота, должна иметь следующию сигнатуру function(signal_name,param){}
     * 
     * <code>
     * Пример использования
     * new signal().emit("catalogControl.OpenObject",{})
     *
     * </code>
     */
    this.connect = function(slot_name, signal_name, slot_function)
    {
        if (this.slotArray[signal_name] == undefined)
        {
            this.slotArray[signal_name] = new Array()
        }
        this.slotArray[signal_name][slot_name] = slot_function
        console.log("На прослушивание сигнала " + signal_name + " добавлен слот " + slot_name + "")
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
     * @param signal_name Имя сигнала
     * @param param Параметры переданые слоту при вызове в втором аргументе
     */
    this.emit = function(signal_name, param)
    {
        if (this.slotArray[signal_name] == undefined)
        {
            console.log("На сигнал " + signal_name + " нет подписчиков")
        }
        else
        {
            console.log("Сигнал " + signal_name + " подписаны слоты")
            for (var slot in this.slotArray[signal_name])
            {
                this.slotArray[signal_name][slot](signal_name, param)
            }
        }
    }
     
    /*
     *  генерация события будут оповещены и соседние вкладки
     *  @eName string - имя события 
     *  использование .emit('любое название события', [ Параметры события ])
     */
    this.send_emit = function (signal_name, param) 
    {
        if (this.slotArray[signal_name] == undefined)
        {
            console.log("На сигнал " + signal_name + " нет подписчиков")
        }
        else
        {
            console.log("Сигнал " + signal_name + " подписаны слоты")
            for (var slot in this.slotArray[signal_name])
            {
                this.slotArray[signal_name][slot](signal_name, param)
            }
        }

        if(window['localStorage'] !==undefined  )
        {
            var curent_custom_id = ""
            for(var i=0; i<16; i++)
            {
                curent_custom_id += "_"+Math.random()
            }

            last_custom_id = curent_custom_id.replace(/0\./img,"")
            window['localStorage']['CustomUserSignal_StorageEmit']= JSON.stringify({name:eName, custom_id:curent_custom_id, param:param}); 
        }
    }

    function storageEventHandler(e)
    {
        //console.log( e.newValue )
        var data = JSON.parse(e.newValue);

        console.log( data.name )
        //console.log( data.arguments )
        Signal().emit( data.name, data.param )
    }

    if( "addEventListener" in window )
    {
        window.addEventListener('storage', storageEventHandler, false);
    }
    else
    {
        document.attachEvent('onstorage', storageEventHandler );
    }
}
signal.prototype.slotArray = new Array()

