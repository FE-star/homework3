class callbackQueues {
	constructor() {
		// code
		this.firing = false;
		this.list = [];
		this.firingIndex = 0;
		this.firingLength = 0;
		this.stack = [];
		this.called = false;
		this.fn = {}
	}

	// methods
	add(){
		if(this.list){
			//let start = list.length
			((allArgs)=>{
				if(!allArgs || !allArgs.length){
					return
				}
				let input  = [], args = Array.prototype.slice.call(allArgs[0])
				if(typeof args[0] === "function"){
					input.push(args[0])
					for (let i = 1, length = args.length ; i < length; i++ ) {
						input.push(args[i])
					}
					
				} else if(typeof args[0] === "string"){
					input.push(args[0])
				} else if(args[0] && args[0].length){
					this.add(args[0])

				}
				if(input.length > 0){
					this.list.push(input)
					if(this.called){
						this.fire(this.fn)
					}
				}

			})(arguments)
			if(this.firing){
				this.firingLength = this.list.length
			}
		}
	}
	fireWith(context, args){
		if(this.list){
			args = args || []
			args = [ context, args.slice ? args.slice() : args ]
			//
			if(this.firing){
				this.stack.push(args)
			} else {
				this.fire(args)
			}
		}
		return this
	}
	fire(data){
		this.firingLength = this.list.length
		this.firing = true
		this.firingIndex = 0
		this.fn = data
		this.called = true
		let inputs = [], input = [], firingList = this.list.slice()
		for(;this.list && this.firingIndex < this.firingLength; this.firingIndex++){
			// this.list[this.firingIndex].apply(data[0], data[1])
			inputs = firingList[this.firingIndex].slice()
			input = inputs.splice(0,1)
			if(typeof input[0] === 'string'){
				data[1].apply(data[0], input)
			} else if(typeof input[0] === 'function') {
				data[1].apply(data[0], input[0].apply(input[0], inputs))
			}
			this.list.splice(this.firingIndex, 1)
		}
		this.firing = false
		if(this.list && this.stack && this.stack.length){
			fire(this.stack.shift())
		}
		return this
	}
	firing(){
		return !!this.firing
	}
	disable(){
		this.list = this.stack = undefined
		return this
	}
	lock(){
		this.stack =  undefined
		this.disable()
		return this
	}
}

module.exports = callbackQueues