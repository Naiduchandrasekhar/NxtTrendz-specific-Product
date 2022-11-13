// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachOne} = props
  console.log(eachOne)
  const {title, price, imageUrl, brand, rating} = eachOne
  return (
    <li>
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similarImageUrl"
      />
      <h3>{eachOne.title}</h3>
      <p className="AB">by {brand}</p>
      <div className="prClass">
        <p className="price">Rs {price} /-</p>
        <div className="rating">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            className="star"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
