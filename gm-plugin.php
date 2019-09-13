<?php
/**
*   Plugin Name: Google Maps
*   Description: plugin for custom Google Maps element
*   Version: 1.0.0
*   Author: Peter Milev 
*/

function google_maps_register_block() {
    wp_register_script(
        'google-maps',
        plugins_url( 'js/googleMapsBlock.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element')
    );

    $colsStr = "city,country,region,type";
    $cols = explode(",", $colsStr);
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'markers';

    $filters_values = array();
    foreach ($cols as $col_name) {
        $filters_values[$col_name] = $wpdb->get_results( "SELECT DISTINCT $col_name FROM $table_name LIMIT 10;" ); //ORDER BY $col_name ASC
    }

    wp_localize_script( 'google-maps', 'filters_values', $filters_values );
 
    register_block_type( 'gm-plugin/google-maps', array(
        'editor_script' => 'google-maps',
    ) );
}
add_action( 'init', 'google_maps_register_block' );

function load_my_scripts() {
    wp_enqueue_script('myScript', plugins_url( 'js/googleMaps.js', __FILE__ ), array('jquery'), false, true );
	wp_enqueue_script('googleScript', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBrs6IwIvyxTG0IkEBuFkpImHscVt36Riw&callback=initMap', array(), false, true );

	global $wpdb;
	$table_name = $wpdb->prefix . 'markers';
	$markers = $wpdb->get_results( "SELECT * FROM $table_name LIMIT 10;" ); //LIMIT 10

    wp_localize_script( 'myScript', 'argsArray', array(
        'db_markers' => $markers,
        'ajaxUrl' => admin_url('admin-ajax.php')
    ) );
}
add_action('wp_enqueue_scripts', 'load_my_scripts');

function handle_filters_request() {
    $colsStr = "city,country,region,type";
    $cols = explode(",", $colsStr);

    global $wpdb;
    $table_name = $wpdb->prefix . 'markers';

    $post_filters = isset($_POST['filters'])?$_POST['filters']:[];

    if(count($cols) != count($post_filters)) {
        $response = array(
            'status' => 200,
            'message' => 'Error in filters length'
        );
        wp_send_json($response);
        wp_die();
    }

    $filters = array();
    for ($i = 0; $i < count($post_filters); $i++) {
        if( $post_filters[$i] != "" ) {
            $filters[$cols[$i]] = $post_filters[$i];
        }
    }
    
    $sql = "SELECT * FROM $table_name";
    $sql_arr = array();

    if( count($filters) > 0 ) {
        $sql .= " WHERE ";
        $last_key = array_keys($filters)[count($filters)-1];
        foreach ($filters as $key => $value) {
            $curr_filters = explode(",", $value);
            if( count($curr_filters) > 0 ) {
                $sql .= "$key IN (";

                $curr_last_key = array_keys($curr_filters)[count($curr_filters)-1];
                foreach ($curr_filters as $k => $v) {
                    $sql .= "\"%s\"";
                    array_push($sql_arr, $v);

                    if( $k != $curr_last_key ) {
                    $sql .= ", ";
                    }
                }
                $sql .= ")";
                if($key != $last_key) {
                    $sql .= " AND ";
                }
            }
        }
    }

	$results = $wpdb->get_results( $wpdb->prepare( 
        $sql, 
        $sql_arr
    ) );
    
	$response = array(
		'message' => 'Successfull Request',
		'body' => $results
	);
	wp_send_json($response);
	wp_die();
}
add_action( 'wp_ajax_filters_request', 'handle_filters_request' );
add_action( 'wp_ajax_nopriv_filters_request', 'handle_filters_request' );

function register_plugin_styles() {
	wp_register_style( 'style', plugins_url( 'gm-plugin/css/style.css' ) );
	wp_enqueue_style( 'style' );
}
add_action( 'wp_enqueue_scripts', 'register_plugin_styles', PHP_INT_MAX);

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
*   AND between filters
*   update fiters depending on another filters 
*   military design*/


