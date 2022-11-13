// Write your code here
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiProductConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    productDetailsData: {},
    similarData: [],
    cartItemCount: 1,
    apiType: 'INITIAL',
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiType: apiProductConstants.loading})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const ApiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(ApiUrl, options)
    if (response.ok === true) {
      const responseData = await response.json()
      const updatedData = {
        id: responseData.id,
        imageUrl: responseData.image_url,
        price: responseData.price,
        rating: responseData.rating,
        description: responseData.description,
        brand: responseData.brand,
        similarProducts: responseData.similar_products.map(product => ({
          id: product.id,
          availability: product.availability,
          brand: product.brand,
          description: product.description,
          imageUrl: product.image_url,
          price: product.price,
          rating: product.rating,
          title: product.title,
          totalReviews: product.total_reviews,
        })),
        title: responseData.title,
        totalReviews: responseData.total_reviews,
        availability: responseData.availability,
      }
      this.setState({
        productDetailsData: updatedData,
        similarData: updatedData.similarProducts,
        apiType: apiProductConstants.success,
      })
    } 
    if (response.status === 404) {
      this.setState({
        apiType: apiProductConstants.failure,
      })
  }

  onClickPlus = () => {
    this.setState(prevState => ({cartItemCount: prevState.cartItemCount + 1}))
  }

  onClickMinus = () => {
    const {cartItemCount} = this.state
    if (cartItemCount > 1) {
      this.setState(prevState => ({cartItemCount: prevState.cartItemCount - 1}))
    }
  }

  continueShopping = () => {
    const {history} = this.props
    history.push('/products')
  }

  renderLoadingView = () => (
    <div testid="loader" className="mainContainer">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {productDetailsData, similarData, cartItemCount} = this.state
    return (
      <>
        <div className="mainContainer">
          <div className="productDetailsContainer">
            <div>
              <img
                src={productDetailsData.imageUrl}
                alt="product"
                className="imageUrl"
              />
            </div>
            <div className="descriptionCard">
              <h1 className="headerTitle">{productDetailsData.title}</h1>
              <p className="price">Rs {productDetailsData.price}/-</p>
              <div className="ratingContainer">
                <div className="rating">
                  <p>{productDetailsData.rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                    alt=" star"
                    className="star"
                  />
                </div>
                <span className="reviews">
                  {productDetailsData.totalReviews} Reviews
                </span>
              </div>
              <p className="description">{productDetailsData.description}</p>
              <p className="AB">
                <span className="ABClass">Available: </span>
                {productDetailsData.availability}
              </p>
              <p className="AB">
                <span className="ABClass">Brand: </span>
                {productDetailsData.brand}
              </p>
              <hr />
              <div className="bsLogos">
                <button
                  type="button"
                  onClick={this.onClickPlus}
                  className="pmButton"
                  testid="plus"
                >
                  <BsPlusSquare />
                </button>
                <p className="cartCount">{cartItemCount}</p>
                <button
                  type="button"
                  onClick={this.onClickMinus}
                  className="pmButton"
                  testid="minus"
                >
                  <BsDashSquare />
                </button>
              </div>
              <button className="buttonAdd" type="button">
                ADD TO CART
              </button>
            </div>
          </div>
          <div>
            <h1>Similar Products</h1>
            <ul className="similarProductContainer">
              {similarData.map(eachOne => (
                <SimilarProductItem key={eachOne.id} eachOne={eachOne} />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderNoProductView = () => (
    <div className="mainContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
        className="NotFoundImage"
      />
      <h1>Product Not Found</h1>
      <button
        className="continueButton"
        onClick={this.continueShopping}
        type="button"
      >
        Continue Shopping
      </button>
    </div>
  )

  renderSwitchMethod = () => {
    const {apiType} = this.state
    switch (apiType) {
      case apiProductConstants.loading:
        return this.renderLoadingView()

      case apiProductConstants.success:
        return this.renderSuccessView()

      case apiProductConstants.failure:
        return this.renderNoProductView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderSwitchMethod()}
      </>
    )
  }
}

export default ProductItemDetails
