<?php
/**
 * Plugin Name: Phanteks EX6 Max Ultra Page
 * Description: Interactive NexLinq and telemetry feature blocks for the EX6 Max Ultra.
 * Version: 0.3.0
 * Author: Phanteks
 * Requires at least: 6.2
 * Requires PHP: 7.4
 * Text Domain: phanteks-ex6
 */

defined('ABSPATH') || exit;

define('PHANTEKS_EX6_VERSION', '0.3.0');
define('PHANTEKS_EX6_URL', plugin_dir_url(__FILE__));
define('PHANTEKS_EX6_PATH', plugin_dir_path(__FILE__));

/**
 * Register shared assets once so the shortcode can enqueue them from any editor.
 */
function phanteks_ex6_register_assets(): void
{
    wp_register_style(
        'phanteks-ex6',
        PHANTEKS_EX6_URL . 'assets/css/nexlinq.css',
        [],
        PHANTEKS_EX6_VERSION
    );

    wp_register_style(
        'phanteks-ex6-telemetry',
        PHANTEKS_EX6_URL . 'assets/css/telemetry-simulator.css',
        ['phanteks-ex6'],
        PHANTEKS_EX6_VERSION
    );

    wp_register_script(
        'phanteks-ex6',
        PHANTEKS_EX6_URL . 'assets/js/nexlinq.js',
        [],
        PHANTEKS_EX6_VERSION,
        true
    );

    wp_register_script(
        'phanteks-ex6-telemetry',
        PHANTEKS_EX6_URL . 'assets/js/telemetry-simulator.js',
        [],
        PHANTEKS_EX6_VERSION,
        true
    );
}
add_action('wp_enqueue_scripts', 'phanteks_ex6_register_assets');

/**
 * Enqueue both feature bundles. WordPress safely ignores duplicate calls.
 */
function phanteks_ex6_enqueue_assets(): void
{
    if (!wp_style_is('phanteks-ex6', 'registered')) {
        phanteks_ex6_register_assets();
    }

    wp_enqueue_style('phanteks-ex6');
    wp_enqueue_style('phanteks-ex6-telemetry');
    wp_enqueue_script('phanteks-ex6');
    wp_enqueue_script('phanteks-ex6-telemetry');
}

/**
 * Enqueue early for ordinary page content. The shortcode callback below is the
 * fallback for page builders, widgets, and custom-field shortcode rendering.
 */
function phanteks_ex6_maybe_enqueue_assets(): void
{
    if (!is_singular()) {
        return;
    }

    $post = get_queried_object();
    if ($post instanceof WP_Post && has_shortcode($post->post_content, 'ex6_max_ultra')) {
        phanteks_ex6_enqueue_assets();
    }
}
add_action('wp_enqueue_scripts', 'phanteks_ex6_maybe_enqueue_assets', 20);

function phanteks_ex6_render_page(): string
{
    phanteks_ex6_enqueue_assets();

    ob_start();
    require PHANTEKS_EX6_PATH . 'templates/ex6-max-ultra.php';
    return (string) ob_get_clean();
}
add_shortcode('ex6_max_ultra', 'phanteks_ex6_render_page');
