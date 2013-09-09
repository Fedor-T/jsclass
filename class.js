var Class = (function(){
  var extend = function(destination, source) {
    for (var property in source)
      destination[property] = source[property]
    return destination
  }
  var F = new Function

  var Class = function(constructor, parent){
    constructor = constructor || Class.prototype.superConstructor

    extend(constructor, Class)
    extend(constructor.prototype, Class.prototype)
    if(parent){
      F.prototype = parent.prototype
      constructor.prototype = new F
      constructor.prototype._super_ = constructor.prototype.super = parent.prototype

    }
    constructor.prototype.constructor = constructor
    return constructor
  }

  Class.def = function(name, cb){
    if(typeof name == "object"){
      this.defChain(name)
    } else {
      this.prototype[name] = cb
    }
  }

  Class.defChain = function(methods){
    for(var name in methods){
      this.prototype[name] = methods[name]
    }
  }

  Class.undef = function(name){
    delete this.prototype[name]
  }

  Class.prototype = {
    superConstructor: function(){
      if(!this._super_)
        return

      F.prototype = this._super_
      var tmp = new F
      this._super_.constructor.apply(tmp, arguments)
      for(var name in F.prototype){
        if(['superConstructor', 'send', 'methodMissing', '_super_'].indexOf(name) == -1)
          F.prototype[name] = F.prototype[name].bind(tmp)
      }
      this.super = tmp
    },

    send: function(){
      var name = arguments[0]
      var args = [].slice.call(arguments, 1, arguments.length)
      if(this[name] && typeof this[name] == 'function')
        return this[name].apply(this, args)
      else
        return this.methodMissing.call(this, name, args)
    },

    methodMissing: function(name, args){
      console.log("Method "+name+" is undefined missing.", args)
    }

  }

  return Class
})()

