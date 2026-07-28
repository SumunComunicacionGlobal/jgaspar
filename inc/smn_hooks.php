<?php

// Agrega un filtro para el bloque de consulta de WordPress
// que muestra los posts relacionados en la página de un post y los filtra por categorías
add_filter('render_block_data', function ($parsed_block) {
    if (
        is_single() &&
        isset($parsed_block['blockName']) &&
        $parsed_block['blockName'] === 'core/query' &&
        isset($parsed_block['attrs']['className']) &&
        strpos($parsed_block['attrs']['className'], 'is-style-is-related-posts') !== false
    ) {
        $category_ids = wp_get_post_categories(get_the_ID());

        if (!empty($category_ids)) {
            $parsed_block['attrs']['query']['categoryIds'] = $category_ids;
            $parsed_block['attrs']['query']['exclude'] = [get_the_ID()];
            $parsed_block['attrs']['query']['sticky'] = '';
            $parsed_block['attrs']['query']['perPage'] = 6;
        }
    }

    return $parsed_block;
});

// Fuerza orden aleatorio para el Query Loop de proyectos relacionados.
add_filter('query_loop_block_query_vars', function ($query, $block) {
    $attrs = $block->parsed_block['attrs'] ?? [];
    $class_name = $attrs['className'] ?? '';
    $anchor = $attrs['anchor'] ?? '';

    if (
        strpos($class_name, 'proyectos-relacionados') !== false ||
        $anchor === 'proyectos-relacionados'
    ) {
        $query['orderby'] = 'rand';
        $query['order'] = 'DESC';
        $query['cache_results'] = false;
        $query['ignore_sticky_posts'] = 1;
        $query['no_found_rows'] = true;
        $query['smn_proyectos_relacionados_random'] = true;
    }

    return $query;
}, 10, 2);

// Reafirma el orden aleatorio si otro filtro modifica el WP_Query después.
add_action('pre_get_posts', function ($query) {
    if (
        is_admin() ||
        !$query instanceof WP_Query ||
        !$query->get('smn_proyectos_relacionados_random')
    ) {
        return;
    }

    $query->set('orderby', 'rand');
    $query->set('order', 'DESC');
    $query->set('cache_results', false);
    $query->set('ignore_sticky_posts', 1);
    $query->set('no_found_rows', true);
}, 999);

// Última capa: fuerza RAND() en el SQL de ese bucle específico.
add_filter('posts_orderby', function ($orderby, $query) {
    if ($query instanceof WP_Query && $query->get('smn_proyectos_relacionados_random')) {
        return 'RAND()';
    }

    return $orderby;
}, 999, 2);