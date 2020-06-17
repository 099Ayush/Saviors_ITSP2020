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

function predict_length(width) {
    if (width <= 2.4) {
        return 5;
    } else {
        return 10;
    }
}

function predict_accn1(speed) {
    switch (true) {
        case speed < 19.6:
            return 0.89;
        case speed < 22.4:
            return 0.80;
        case speed < 25.17:
            return 0.72;
        default:
            return 0.73;
    }
}

function predict_accn2(speed) {
    switch (true) {
        case speed < 22.4:
            return 0.53;
        case speed < 25.17:
            return 0.41;
        default:
            return 0.51;
    }
}

var v_a, v_b, v_c, w, D, s, lA, xA, xB, xC;
var a;                       // Acceleration of car B.
var fr = 120;
var sd1 = 5;                 // Frame rate (fps).
var sd2 = 25;                 // Safe distance after overtake (m).
var lB = 5;                   // Length of car B (m).

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
    setTimeout(function () {
        $('form').css('transform', 'scaleX(1) scaleY(0.1)');
    }, 200);
    setTimeout(function () {
        $('form').css('transform', 'scaleX(1) scaleY(1)');
        $('form').css('border-top', 'solid 1px');
        $('form').css('border-bottom', 'solid 1px');
    }, 800);
    setTimeout(function () {
        $('form table').css('opacity', '1');
    }, 1200);

    // On submit, disable inputs and store initial measurements.
    $('input[type=\'button\']').click(function () {
        $('input').prop('disabled', 'true').css('cursor', 'default');

        v_a = parseFloat($('#vAs').val()) * 5 / 18;
        v_b = parseFloat($('#vBs').val()) * 5 / 18;
        v_c = - parseFloat($('#vCs').val()) * 5 / 18;
        a = predict_accn1(v_a);

        w = parseFloat($('#wA').val());
        D = parseFloat($('#Ds').val());
        s = parseFloat($('#ss').val());
        lA = predict_length(w);

        // xI represents the head of the engine bonnet of car I.
        xA = 0;
        xB = xA - s - lA;
        xC = xB + D;
        
        play();
    });

    function update_form(fD, fs, fv_b) {
        $('#Ds').val(fD);
        $('#ss').val(fs);
        $('#vBs').val(fv_b * 18 / 5);
        $('#D').val(parseInt(fD));
        $('#s').val(parseInt(fs));
        $('#vB').val(parseInt(fv_b * 18 / 5));
    }

    /**
     * Update the position of the cars per frame.
     */
    async function play() {
        while (true) {
            let duration = 1 / fr;
            xB += duration * (2 * v_b + a * duration) / 2;
            xA += duration * v_a;
            xC += duration * v_c;

            v_b += a * duration;

            console.log(a);

            D = xC - xB;
            s = (xB <= xA)?(xA - xB - lA):(xB - xA - lB);

            if (xB >= xA) a = predict_accn2(v_a);

            if (xB + sd2 >= xC) {
                $('form').css('background', '#f004');
                $('input[type=\'button\']').val('Reset').removeAttr('disabled').css('cursor', 'pointer');
                $('input[type=\'button\']').click(function () {
                    location.reload();
                });
                return;
            }

            if (xA + lB + sd1 <= xB) {
                $('form').css('background', '#0f04');
                $('input[type=\'button\']').val('Reset').removeAttr('disabled').css('cursor', 'pointer');
                $('input[type=\'button\']').click(function () {
                    location.reload();
                });
                return;
            }

            update_form(D, s, v_b);
            await sleep(duration * 1000);
        }
    }
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
