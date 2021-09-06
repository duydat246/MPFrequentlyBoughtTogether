import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';

import defaultClasses from './index.css';

const FrequentlyBT = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div>
            frequently bought together
        </div>
    );
}

FrequentlyBT.propTypes = {
    classes: shape({ root: string })
};
FrequentlyBT.defaultProps = {};
export default FrequentlyBT;
