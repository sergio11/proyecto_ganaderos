var __extends = this.__extends || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	__.prototype = b.prototype;
	d.prototype = new __();
};

var EventEmitter = (function(){

	function EventEmitter(){}

	EventEmitter.prototype.addEventListener = function(events,callback,one){
	    if((events && isNaN(parseInt(events))) && typeof(callback) == "function"){
	        var events = events.trim().replace(/\s+/g,' ').split(" ");
	        //Si one es true, marcamos el callback como de una sola ejecución.
	        if (one) callback.one = true;
	        for(var i = 0,len = events.length; i < len; i++)
	            this.events[events[i]] && this.events[events[i]].push(callback);
	    }
	}
        
	EventEmitter.prototype.triggerEvent = function(event,data){
	    if(this.events[event])
	        for(var i = 0,len = this.events[event].length; i < len; i++ ){
	            var callback = this.events[event][i];
	            callback.one && this.events[event].splice(i,1);
	            callback.apply(this,[data]);
	        }    
	}

	return EventEmitter;
})();