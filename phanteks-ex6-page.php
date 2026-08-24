<?php
/**
 * Plugin Name: Phanteks EX6 Max Ultra Page
 * Description: Interactive NexLinq and telemetry feature blocks for the EX6 Max Ultra.
 * Version: 0.2.4
 * Author: Phanteks
 * Text Domain: phanteks-ex6
 */

defined('ABSPATH') || exit;

define('PHANTEKS_EX6_VERSION', '0.2.4');
define('PHANTEKS_EX6_URL', plugin_dir_url(__FILE__));
define('PHANTEKS_EX6_PATH', plugin_dir_path(__FILE__));

/**
 * Load assets only when a published page contains the EX6 shortcode.
 */
function phanteks_ex6_enqueue_assets(): void
{
    if (!is_singular()) {
        return;
    }

    $post = get_queried_object();
    if (!$post instanceof WP_Post || !has_shortcode($post->post_content, 'ex6_max_ultra')) {
        return;
    }

    wp_enqueue_style(
        'phanteks-ex6',
        PHANTEKS_EX6_URL . 'assets/css/nexlinq.css',
        [],
        PHANTEKS_EX6_VERSION
    );

    wp_enqueue_style(
        'phanteks-ex6-telemetry',
        PHANTEKS_EX6_URL . 'assets/css/telemetry-simulator.css',
        ['phanteks-ex6'],
        PHANTEKS_EX6_VERSION
    );

    wp_enqueue_script(
        'phanteks-ex6',
        PHANTEKS_EX6_URL . 'assets/js/nexlinq.js',
        [],
        PHANTEKS_EX6_VERSION,
        true
    );

    wp_enqueue_script(
        'phanteks-ex6-telemetry',
        PHANTEKS_EX6_URL . 'assets/js/telemetry-simulator.js',
        [],
        PHANTEKS_EX6_VERSION,
        true
    );
}
add_action('wp_enqueue_scripts', 'phanteks_ex6_enqueue_assets');

function phanteks_ex6_render_page(): string
{
    ob_start();
    require PHANTEKS_EX6_PATH . 'templates/ex6-max-ultra.php';
    return (string) ob_get_clean();
}
add_shortcode('ex6_max_ultra', 'phanteks_ex6_render_page');
