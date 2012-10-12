<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Craftpricing
 *
 * @author botskonet
 */
class Craftpricing {
	
	
	protected $_json = false;
	
	
	/**
	 * 
	 */
	public function __construct() {
		$_jsonfile = file_get_contents( dirname(__FILE__) . '/js/recipes.js' );
		$this->_json = json_decode($_jsonfile, true);
	}
	
	
	/**
	 * 
	 */
	public function generate(){
		$allitems = array();
		foreach($this->_json as $alias => $item){
			$rsp_item = $this->getItem( $alias );
			if($rsp_item){
				$allitems[] = $rsp_item;
			}
		}
		return $allitems;
	}
	
	
	/**
	 * 
	 */
	protected function getItem( $alias ){
		$item = $this->_json[$alias];
		$buy = $sell = 0;
		if($item){
			if(!isset($item['buy'])){
				if(!empty($item['recipe'])){
					foreach($item['recipe'] as $recipe){
						$r = $this->getItem( $recipe['alias'] );
						// Determines the cost of the recipe materials
						if($r){
							$buy_per_unit = (float)($r['buy'] * $recipe['quantity']);
							$sell_per_unit = (float)($r['sell'] * $recipe['quantity']);
							$buy += $buy_per_unit;
							$sell += $sell_per_unit;
						}
					}
				}
				$item['buy'] = (float)($buy / $recipe['quantity']);
				$item['sell'] = (float)($sell / $recipe['quantity']);
				// cache the price, so future recursion isn't necessary
				$this->_json[$alias]['buy'] = $item['buy'];
				$this->_json[$alias]['sell'] = $item['sell'];
			} else {
				$item['buy'] = (float)($item['sell'] * .4);
			}
			return $item;
		}
		return null;
	}
}