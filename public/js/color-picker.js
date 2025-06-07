document.addEventListener('DOMContentLoaded', function () {
    const colorInputs = document.querySelectorAll('.color-picker');

    colorInputs.forEach(input => {
        const pickr = Pickr.create({
            el: input,
            theme: 'classic',
            default: input.value || '#000000',
            swatches: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#009688', '#FFEB3B'],
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    input: true,
                    save: true
                }
            }
        });

        pickr.on('save', (color) => {
            input.value = color.toHEXA().toString();
        });
    });
});
