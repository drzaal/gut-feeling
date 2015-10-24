function bodyAdd(domEls) {
    var i;
    for (i = 0; i < domEls.length; i++) {
        $(domEls[i].tag).attr("id", domEls[i].idTag).appendTo(domEls[i].appTo).text(domEls[i].dispText);
    }
};

function randomizer(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

/*
 * Converts a given percentage to a coordinate along a bounded vertex-defined linear path.
 * Added some quick lerping
 * @TODO Please note this is tied explicitly to the Gastro vertices and must be generalized
 * @TODO Lerp should be cleaned up / generalized
 */
var pathPercent2Cart = function (percent, vertices) {
    //same hoisting issue as omnom
    var lite_post_id, lerp_remainder = 0,
        lerp_vector = {
            "x": 0,
            "y": 0
        };
    if (percent < 100) {
        lerp_remainder = percent / 100 * (vertices.length - 1);
        lite_post_id = Math.floor(lerp_remainder);
        lerp_remainder = lerp_remainder % 1;

        lerp_vector.x = (vertices[lite_post_id + 1][0] - vertices[lite_post_id][0]) * lerp_remainder;
        lerp_vector.y = (vertices[lite_post_id + 1][1] - vertices[lite_post_id][1]) * lerp_remainder;
    } else {
        lite_post_id = vertices.length - 1;
    }
    lite_post = vertices[lite_post_id];

    return {
        'x': lite_post[0] + lerp_vector.x,
        'y': lite_post[1] + lerp_vector.y
    };
};
