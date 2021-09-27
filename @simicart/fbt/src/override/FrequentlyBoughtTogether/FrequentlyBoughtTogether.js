import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import defaultClasses from './FrequentlyBoughtTogether.css';
import { useFrequentlyBoughtTogether } from './useFrequentlyBoughtTogether';
import { useProductDetails } from './useProductDetails';

const FrequentlyBoughtTogether = (props) => {
    const { product } = props;

    const { productUrl = "" } = useParams();
    const { fbtData, fbtLoading, derivedErrorMessage } =
        useFrequentlyBoughtTogether({
            url_key: productUrl.replace('.html', '')
        });

    const skuDatas = [];
    if (fbtData) {
        var len = fbtData.products.items.length;
        for (let i = 0; i < len; i++) {
            let skuData = fbtData.products.items[i].sku
            skuDatas.push(skuData);
        }
    }

    const { detailsData,
        detailsLoading,
        deriveErrorMessage } =
        useProductDetails({
            sku_product: skuDatas
        });

    const fbtList = []
    if (detailsData) {
        var len = detailsData.products.items.length;
        for (var i = 0; i < len; i++) {
            let fbtDatas = detailsData.products.items[i].fbt_products
            for (var j = 0; j < fbtDatas.length; j++) {
                let fbt = fbtDatas[j]
                fbtList.push(fbt)
            }
        }
    }
    fbtList.unshift(product)

    const dataPriceItems = fbtList.map(item => (item.price.regularPrice.amount.value))

    const [checkedVals, setCheckedVals] = useState([])

    const [total, setTotal] = useState(0)

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.fbt}>

            <div className={classes.fbtTitle}>
                <h2 id="block-fbt-heading">Frequently Bought Together</h2>
            </div>
            <div className={classes.fbtContent}>
                <form >
                    <input name="form-key" type="hidden" value="qwMftPeI0eqzf77X" />
                    <div className={classes.fbtProductsGrid}>
                        <ol className={classes.fbtImageBox}>{
                            fbtList.map(item => (
                                <>
                                    {checkedVals.includes(item.id) && (<li className={classes.fbtPlus}>+</li>)}
                                    {checkedVals.includes(item.id) && (<li className={classes.item} key={item.id}>
                                        <span>
                                            <span className={classes.productImageContainer} style={{ width: "75px" }}>
                                                <a href="#">
                                                    <span className={classes.productImageWrapper}>
                                                        <img className={classes.productImagePhoto} src={item.small_image.url || item.small_image} alt="Image" loading="lazy" width="152" height="190" />
                                                    </span>
                                                </a>
                                            </span>
                                        </span>
                                    </li>)}
                                </>
                            ))
                        }</ol>
                        <div className={classes.fbtPriceBox}>
                            <div className={classes.fbtTotalPrice}>
                                <span className={classes.fbtTotalPriceLabel}> Total price: </span>
                                <span className={classes.fbtPriceWrapper} data-price-amount={total}>
                                    <span className={classes.fbtPrice}>${total}.00</span>
                                </span>
                            </div>
                            <div className={classes.fbtButton}>
                                <div className={classes.fbtAddToCart}>
                                    <button type="submit" title="add all ${fbtList.length} to cart" className={classes.mpfbtToCart}>
                                        <span>Add all {checkedVals.length} product to cart</span>
                                    </button>
                                </div>
                                <div className={classes.fbtAddToWishlist}>
                                    <button type="submit" title="Add all ${fbtList.length} to Wishlist" className={classes.mpfbtToWishList}>
                                        <span>Add all {checkedVals.length} product to Wishlist</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={classes.clear}></div>
                    </div>
                    <div className={classes.fbtProductsRows}>
                        <ul>{fbtList.map(item => (
                            <li>
                                <input className={classes.relatedCheckbox}
                                    type="checkbox"
                                    id={item.id}
                                    data-price-amount={dataPriceItems}
                                    id={`mp-fbt-checkbox-${item.id}`}
                                    name={`mp_fbt[${item.id}]`}
                                    checked={checkedVals.includes(item.id)}
                                    onChange={() => {
                                        if (checkedVals.includes(item.id)) {
                                            let newCheckVal = checkedVals.filter(e => e !== item.id)
                                            setCheckedVals(newCheckVal)
                                            setTotal(total - item.price.regularPrice.amount.value)
                                        }
                                        else {
                                            let newCheckVal = checkedVals;
                                            newCheckVal.push(item.id);
                                            setCheckedVals([...newCheckVal]);
                                            setTotal(total + item.price.regularPrice.amount.value)
                                        }
                                    }
                                    }
                                />
                                <span>
                                    <div className={classes.fbtCheckboxLabel}>
                                        <a href=""> {item.name} </a>
                                        <span className={classes.fbtItemPrice} data-price-amount={item.price.regularPrice.amount.value}>${item.price.regularPrice.amount.value}.00</span>
                                    </div>
                                </span>
                            </li>
                        ))}</ul>
                    </div>
                </form>
            </div>
        </div>
    );
}

FrequentlyBoughtTogether.propTypes = {
    classes: shape({ root: string })
};
FrequentlyBoughtTogether.defaultProps = {

};
export default FrequentlyBoughtTogether;
