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
    
    global $wpdb;
	$table_name = $wpdb->prefix . 'markers';
    $existing_columns = $wpdb->get_col("DESC {$table_name}", 0);
    $markers = $wpdb->get_results( "SELECT * FROM $table_name;" );

    $db_markers = array (
        'columns' => $existing_columns,
        'markers' => $markers
    ) ;

    wp_localize_script( 'google-maps', 'db_markers', $db_markers );
 
    register_block_type( 'gm-plugin/google-maps', array(
        'editor_script' => 'google-maps',
    ) );
}

function register_plugin_styles() {
	wp_register_style( 'style', plugins_url( 'gm-plugin/css/style.css' ) );
	wp_enqueue_style( 'style' );
}

function load_my_scripts() {
    // wp_enqueue_script('jqueryS', 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js', array(), false, true);
	wp_enqueue_script('myScript', plugins_url( 'js/googleMaps.js', __FILE__ ), array(), false, true );
	wp_enqueue_script('googleScript', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrs6IwIvyxTG0IkEBuFkpImHscVt36Riw&callback=initMap', array(), false, true );
    wp_enqueue_script('dropDownFunc', plugins_url( 'js/dropDownFunc.js', __FILE__ ), array('jquery'), false, true );

	global $wpdb;

	$table_name = $wpdb->prefix . 'markers';

	$markers = $wpdb->get_results( "SELECT * FROM $table_name;" );


    wp_localize_script( 'myScript', 'db_markers', $markers );
    wp_localize_script( 'dropDownFunc', 'db_markers', $markers );
}

function callback_function() {
    
}

add_action( 'init', 'google_maps_register_block' );
Add_action( 'init','callback_function' );
add_action('wp_enqueue_scripts', 'load_my_scripts');
add_action( 'wp_enqueue_scripts', 'register_plugin_styles' );

function activate() {
	global $wpdb;

	$table_name = $wpdb->prefix . 'markers';
	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE IF NOT EXISTS $table_name (
      id integer NOT NULL AUTO_INCREMENT,
      city text,
      country text,
      countryCode text,
      distance double,
      geodbId integer,
      latitude double,
      longitude double,
      name text,
      region text,
      regionCode text,
      type text,
      wikiDataId text,
	  
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

/**
*	check for updates in cities
*	add filter
*	check for errors in request
*	
*   distinc filters names
*   sort
*   auto complite
*   AND betrween filters
*   update fiters depending on another filters

