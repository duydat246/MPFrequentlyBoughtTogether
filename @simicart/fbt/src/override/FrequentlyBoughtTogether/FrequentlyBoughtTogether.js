import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';
import defaultClasses from './FrequentlyBoughtTogether.css';
import { useFrequentlyBoughtTogether } from './useFrequentlyBoughtTogether';
import { useProductDetails } from './useProductDetails';
import { useState, useEffect } from 'react';

const FrequentlyBoughtTogether = (props) => {
    const { product } = props;
    console.log(product.small_image);

    const { productUrl = "" } = useParams();
    const { fbtData, fbtLoading, derivedErrorMessage } =
        useFrequentlyBoughtTogether({
            url_key: productUrl.replace('.html', '')
        });

    console.log(fbtData);

    const skuDatas = [];
    if (fbtData) {
        var len = fbtData.products.items.length;
        for (let i = 0; i < len; i++) {
            let skuData = fbtData.products.items[i].sku
            skuDatas.push(skuData);
        }
        console.log(skuDatas)
    }


    const { detailsData,
        detailsLoading,
        deriveErrorMessage } =
        useProductDetails({
            sku_product: skuDatas
        });
    console.log("detailsData: ", detailsData);

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
    console.log(fbtList);
    fbtList.unshift(product)
    console.log(fbtList);


    const dataPriceItems = fbtList.map(item => (item.price.regularPrice.amount.value))

    const totalDataPrice = dataPriceItems.reduce((a, b) => a + b, 0)


    // checkbox
    const [checked, setChecked] = useState()

    const handleChange = () => {
        setChecked(!checked)
    }
    //

    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.fbt}>

            <div className={classes.fbtTitle}>
                <h2 id="block-fbt-heading">Frequently Bought Together</h2>
            </div>
            <div className={classes.fbtContent}>
                <form>
                    <input name="form-key" type="hidden" value="qwMftPeI0eqzf77X" />
                    <div className={classes.fbtProductsGrid}>
                        <ol className={classes.fbtImageBox}>{
                            fbtList.map(item => (
                                <>
                                    <li className={classes.fbtPlus}>+</li>
                                    {/* check or uncheck to show or hide item */}
                                    {checked && (<li className={classes.item} key={item.id}>
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
                                <span className={classes.fbtPriceWrapper} data-price-amount={totalDataPrice}>
                                    <span className={classes.fbtPrice}>${totalDataPrice}.00</span>
                                </span>
                            </div>
                            <div className={classes.fbtButton}>
                                <div className={classes.fbtAddToCart}>
                                    <button type="submit" title="add all ${fbtList.length} to cart" className={classes.mpfbtToCart}>
                                        <span>Add all {fbtList.length} product to cart</span>
                                    </button>
                                </div>
                                <div className={classes.fbtAddToWishlist}>
                                    <button type="submit" title="Add all ${fbtList.length} to Wishlist" className={classes.mpfbtToWishList}>
                                        <span>Add all {fbtList.length} product to Wishlist</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={classes.clear}></div>
                    </div>
                    <div className={classes.fbtProductsRows}>
                        <ul>{fbtList.map(item => (
                            <li>
                                {/* checkbox */}
                                <input className={classes.relatedCheckbox}
                                    type="checkbox"
                                    id={item.id}
                                    data-price-amount={dataPriceItems}
                                    id={`mp-fbt-checkbox-${item.id}`}
                                    name={`mp_fbt[${item.id}]`}
                                    checked={checked}
                                    onChange={() => handleChange()}
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
