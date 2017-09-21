![alt text](HyperScript-128.png)
# HyperScript
ГиперСкрипт - Новый язык для Web, который не тащит за собой груз императивных языков прошлого века.

## Первое и главное! Надоели уже СТРОКИ!!!!
```javascript
Серъезно, вот в печенках сидят уже эти 'ошибка ошибок непарных и не тех кавычек"
```
<style>
p{
	white-space: pre
}
</style>

вот даже парсер гитхаба бомбит )))
Все что HS не может разобрать, превращается в строку!
Так что вот это все были примеры строк в HS.
Если же вам по каким-то причинам очень нужно чет обозначить как строку
```javascript
//вот очень простой и быстрый способ это сделать!
```
также стоит сказать, что все вот это вот написанное будет объединено в одну большую строку с энтерами.
ДА! БОЛЬШЕ НЕПРЕДСКАЗУЕМОГО КОДА!
Например, 2+2 вы увидите тут как "2+2", потому что вся строчка не распознана, а вот,
2+2 
к примеру выше будет 4 )))) потому что выражение ;) ну или пишите 
```javascript
//2+2
```
И если вам нужно объединить что-то в строку, просто напишите это в столбик:
Например вот так:

```javascript
{
    x = 10
    Переменная x равна
    x
}
```

и на экране вы увидите --
```javascript
//Переменная х равна
//10
```
Теперь о главном...

## О блоках.

В HS есть только один тип объектов - блоки!
они же массивы, они же функции! Волшебно, не правда ли ? )))))

Реквестирую лютый бугурт ))))
```javascript
{
    это блок... по сути дела массив с 1 элементом, вот этой вот строкой
}

{
    и это тоже масив, 
    но в нем уже 2 элемента -- эти строки
}

{
    x = 10
    y = 20
    а вот это уже массив из 5ти элементов, причем первые 2 числа,
    эти 2 строки и последний элемент тоже число - нетрудно догадаться, какое )
    x + y
}
```
а вот что необычного... так это то что последний элемент по сути не будет считаться
до тех пор пока объект не будет применен где-либо. Например, выведен в консоль.
последнее значение будет иметь тип распознанной лексеммы. и будет ждать своего часа.
если часа выполниться не представиться, то x + y вполне проканают как строка ))))

вот пример необычного массива:
```javascript
{
    10
    20
    30
    x
    a
    b
    {
        a это вложенный массив
    }
    {
        и это тоже )
    }
    x = {
        а этот еще и по имени доступен будет 
        (ассоциативные массивы!)
    }
    x{
        причем, так писать удобнее.
    }
    #y{
        и так тоже можно...
    }
    все это до тех пор, пока вы не начнете использовать это как функцию )))))
    Причем все эти извращения совершенно норм переваряться
    но вот, когда начнется наследование... типа такого
    y#y1{
        то...
        ничего не взорвется!
        и HS даже не скажет вам очевидное -- undefined is not a capitan america!
        Более того, все логично отработает. (будет создана лексемма с именем y1)
    }
    а вот чтобы случилась магия, вам нужно понимать ключевые аспекты языка
}
```
Ключевых слов в языке - 5.

* **Блок**
* **Селектор**
* **Контекст**
* **Аспекты**
* **Цепочки**

С блоками вроде более менее понятно.
Стоит добавить, что когда блок выполняется как функция, 
его элементы (суть строки) выполняются последовательно
ну это очевидно!

```javascript
{
    x = 10
    y = 20
    z = x + y
}
```

И все! Главное, понимать, что это по сути массив лексемм.
С понятием контекста можно познакомится осознав код 

```javascript
{
    x = 10
    y = 20
    z = x + a
    {
        f = (x + y) * 2
        f = f * a + coef
    }
    a = 40
}
```

И вот тут может наступить когнитивный диссонанс...
И ладно бы еще a объявленная после z, но вот coef не объявлен вообще!
Стоит вспомнить, что сточки массива в HS -- суть лексеммы. И выполняются они опосля...
Ленивые они, одним словом.
Так вот контекст, это что-то вроде Scope в котором будет происходить выполнение.
Также во время выполнения, блок формирует собственный Контекст, в котором доступны
все объявленные поля. И по сути дела, внутренний блок посчитается последним.
Но результат будет там же где он стоит. в 4й ячейке!

Идея -- условия и циклы...
Условия - оч просто... если лексемма может быть выполнена в данном контексте,
она будет выполнена )))

Примеры
```javascript
{
    a = -1;
    x = x + { a > 0; a }
    x = x - { a < 0; a }
}
```
Чет типа такого... )

Циклы. По умолчанию, применение аспекта к блоку, позволяет обойти все его элементы
также можно будет использовать редюсеры и генераторы.
```javascript
{
    items = {
        querySelectorAll
        //.items
    }
    items{
        class = active
    }
}

или проще

{
    {
        querySelectorAll
        //.items
    }
    {
        class = active
    }
}

или даже в одном блоке!

{
    querySelectorAll //.items
    class = active
}

Пример генератора

{
    x = 5
    f = {
        x -= 1 {x > 0}
    }
    f#f //Заставит наследоваться друг от друга, пока цепочка не прервется неверной лексеммой
}

ну или синтаксический сахар

{
    x = 5;
    #{ x -= 1 {x > 0} } 
    // Пример самонаследования
}

редюсер

{
    x = 5;
    @{
        #{
            x -= 1 {x > 0}
        }
        y = y + x;
    }
    
    //посчитает сумму всех чисел, примешиваясь на каждой итерации наследования 
}
```

## Объединение контекстов, цепочки.
```javascript
//Примесь... у примеси нет своего контекста, она примешивается к материнскому, 
//при наследовании, конкатенируется с наследуемым контестом


//Использование этих объектов
//Контекст выполнения -- новый объект (по умолчанию)
//Вставляется в Контекст материнского объекта
//Существует 3 типа интерпретации

//1. Определение контекста вызова
//2. Определение контекста назначения
//3. Порядок передачи контекстов
//4. 

//object{} или просто {}
// Использует области видимости как в обычном JS
//

//type#id                  (контекст создается)
//function#id              (используется материнский контекст)
//object#id (по умолчанию) (контексты выполняются от базовых до наследников)
//class#id                 (контексты выполняются от наследников до базовых)
//id                       (инстанцирование объекта)

//function  просто кусок кода в материнском контексте 
//Вариант ()

//Контексты:
//Материнский
//Собственный
//Наследованный

//@mixin примешивание контекста
//.aspect подмена контекста

//Объявление контекста
//Конструирование контекста
//примешивание контекста

{
    type = 20;
    reflect = 30;
    internal = { //(по сути дела то же что и #internal)
        href = "ajcnkjanckjansc";
    }
    function#log{
        console log
    }
    log = function{
        
    }
    log{type}{reflect}{internal href} -- цепочка выполнения контекстов
    
    log#info{} - наследование
    
    log   //В текущем контексте (выведет все содержимое)
}

//Примеры

type#function{
    
}


// Наследование объектов

#baseObject{
    //Сначала выполняется этот код
}

baseObject#derivedObject{
    //Потом этот
}

//

#div{
    
}


div#button{
    
}

button#btnSave{
    
}


//Попытка написать TreeView
//Мутаторы
//Форматирование контекстами (интерпретируемые и неинтерпретируемые части)
//

//1я фаза интерпретаци

div#directoryInfo{
    css{
        .directory-icon{
            
        }
    }
    
    css.directory-icon{
        
    }
    
    div#directoryIcon{
        css{
            .directory-icon{
                border = 'solid 1px red';
                border{
                    solid
                    1px
                    red
                }
                border{solid}{1px}{red}
                border{
                    type = solid
                    thin = 1px
                    color = red
                }
                background{
                    url("ajndckjnckjansckjnakjscn");
                    no-repeat
                    
                }
            }
        }
        
        class.directory-icon
        
    }
}
```







