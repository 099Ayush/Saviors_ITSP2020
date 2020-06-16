/*
---------------------------------------------
 [CAR B>    [CAR A>
 --------------------------------------------
                                    <CAR C]
 --------------------------------------------
Initial measurements:-
v_i :   Speed of car I, I = A, B, C.
w   :   Width of car A.
D   :   Distance between car A and car C.
*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Snippet to update text fields by sliders, and vice versa.
$(document).ready(function () {
    function update_form_1() {
        $('#vA').val($('#vAs').val());
        $('#vB').val($('#vBs').val());
        $('#vC').val($('#vCs').val());
        $('#D').val($('#Ds').val());
        $('#s').val($('#ss').val());
    }
    function update_form_2() {
        $('#vAs').val($('#vA').val());
        $('#vBs').val($('#vB').val());
        $('#vCs').val($('#vC').val());
        $('#Ds').val($('#D').val());
        $('#ss').val($('#s').val());
    }
    update_form_1();
    $('input[type=\'range\']').on('input', function () {
        update_form_1();
    });
    $('input[type=\'text\']').on('input', function () {
        update_form_2();
    });
    setTimeout(function() {
        $('form').addClass('visible1');
    }, 100);
    setTimeout(function() {
        $('form').addClass('visible2');
    }, 700);
    setTimeout(function() {
        $('form table').css('opacity', '1');
    }, 1100);

    $('input[type=\'button\']').click(function () {
        $('input:not([type=\'button\'])').prop('disabled', 'true');
    });
});

/**
 * Creates a prediction model with specified hyperparameter of safe distance.
 * @param   {number}    s   The safe distance maintained between cars A and B in acc. overtake.
 * @returns {Object}        The prediction model.
 */
function Model(s) {
    const model = {};
    model.s = s;
    return model;
}
