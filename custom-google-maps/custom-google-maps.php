<?php
/**
Plugin Name: Google Maps
Description: plugin for custom Google Maps element
Version: 1.0.0
Author: Peter Milev 
*/
function google_maps_register_block() {
    wp_register_script(
        'google-maps',
        plugins_url( 'js/googleMapsBlock.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element')
    );
 
    register_block_type( 'custom-google-maps/google-maps', array(
        'editor_script' => 'google-maps',
    ) );
}

function load_my_scripts() {  
	wp_enqueue_script('myScript', plugins_url( 'js/googleMaps.js', __FILE__ ), array(), false, true );
	wp_enqueue_script('googleScript', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrs6IwIvyxTG0IkEBuFkpImHscVt36Riw&callback=initMap', array(), false, true );

	global $wpdb;

	$table_name = $wpdb->prefix . 'markers';

	$markers = $wpdb->get_results( "SELECT * FROM $table_name;" );

	/*$markers = array(
		'a' => 'zdr',
		'b' => 'mango'
	);*/

	wp_localize_script( 'myScript', 'db_markers', $markers );
}

add_action( 'init', 'google_maps_register_block' );
add_action('wp_enqueue_scripts', 'load_my_scripts');

function activate() {
	global $wpdb;

	$table_name = $wpdb->prefix . 'markers';
	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE IF NOT EXISTS $table_name (
	  id integer NOT NULL AUTO_INCREMENT,
	  lat float(9,6) NOT NULL,
	  lng float(9,6) NOT NULL,
	  PRIMARY KEY  (id)
	) $charset_collate;";

	$wpdb->query($sql);
}

function deactivate() {
	global $wpdb;

	$table_name = $wpdb->prefix . 'markers';
	$sql = "DROP TABLE IF EXISTS $table_name;";
	$wpdb->query($sql);
}

register_activation_hook(__FILE__, 'activate');
register_deactivation_hook(__FILE__, 'deactivate');



