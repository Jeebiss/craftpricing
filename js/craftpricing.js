var CraftPricing = {
	_json: false,
	load: function( json ){
		this._json = json;
	},
	/**
	 * Returns the complete unit price for the item, including
	 * those that this item depends on.
	 */
	getItem: function( alias ){
		var item = this._json[alias], buy = 0, sell = 0;
		// Only if the item was found in the json
		if(typeof item == "object"){
			// If the buy price isn't defined we must determine it
			if(typeof item.buy === "undefined"){
				// For each item in the recipe
				for(var i=0,l = item.recipe.length;i<l;i++){
					var recipe = item.recipe[i], r = this.getItem( recipe.alias );
					if(typeof r == "object" && r != null){
						// Determines the cost of the recipe materials
						var buy_price_per_unit = (parseFloat(r.buy, 10) / parseInt(r.quantity, 10));
						var sell_price_per_unit = (parseFloat(r.sell, 10) / parseInt(r.quantity, 10));
						buy += (buy_price_per_unit * parseInt(recipe.quantity, 10));
						sell += (sell_price_per_unit * parseInt(recipe.quantity, 10));
					}
				}
				item['buy'] = buy;
				item['sell'] = sell;
				
				// cache the price, so future recursion isn't necessary
				this._json[alias]["buy"] = buy;
				this._json[alias]["sell"] = sell;
				
			}
			return item;
		}
		return null;
	},
	/**
	 * Outputs the entire json list using the callback
	 * formatter.
	 */
	generate: function( json, callback ){
		this.load(json);
		for(item in this._json){
			if (this._json.hasOwnProperty(item)){
				var rsp_item = this.getItem( item );
				if(typeof rsp_item === "object" && rsp_item != null){
					if(typeof callback === "function"){
						callback( rsp_item );
					}
				}
			}
		}
	}
}