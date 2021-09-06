import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import React from 'react';
import defaultClasses from './FrequentlyBoughtTogether.css';
import useFrequentlyBoughtTogether from './FrequentlyBoughtTogether'
import { useParams } from 'react-router-dom';


const FrequentlyBoughtTogether = (props) => {

    const { fbtUrl = "" } = useParams();
    const { fbtData, fbtLoading, derivedErrorMessage } = useFrequentlyBoughtTogether({
        url_key: fbtUrl.replace('.html', '')
    })

    console.log(fbtData);

    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className="fbt">
            <h2>Frequently Bought Together</h2>
        </div>
    );
}

FrequentlyBoughtTogether.propTypes = {
    classes: shape({ root: string })
};
FrequentlyBoughtTogether.defaultProps = {};
export default FrequentlyBoughtTogether;
