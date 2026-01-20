import Image from 'next/image'

interface IconProps {
    width?: string;
    marginRight?: string;
}

export const javascript = (props: IconProps = {}) => <Image
            src={require('../../images/icons/javascript.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="JavaScript" />

export const typescript = (props: IconProps = {}) => <Image
            src={require('../../images/icons/typescript.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="TypeScript" />

export const react = (props: IconProps = {}) => <Image
            src={require('../../images/icons/react.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="React" />

export const unity = (props: IconProps = {}) => <Image
            src={require('../../images/icons/unity.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="Unity" />

export const defold = (props: IconProps = {}) => <Image
            src={require('../../images/icons/defold.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="Defold Engine" />

export const construct3 = (props: IconProps = {}) => <Image
            src={require('../../images/icons/construct3.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="Construct 3" />

export const cocos = (props: IconProps = {}) => <Image
            src={require('../../images/icons/cocos.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="Cocos Creator" />

export const haxe = (props: IconProps = {}) => <Image
            src={require('../../images/icons/haxe.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="Haxe" />

export const discord = (props: IconProps = {}) => <Image
            src={require('../../images/icons/discord.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="Discord" />

export const wechat = (props: IconProps = {}) => <Image
            src={require('../../images/icons/wechat.png')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="WeChat" />

/**
 * BRANDS
 */

export const xsolla = (props: IconProps = {}) => <Image
            src={require('../../images/icons/brands/xsolla.jpg')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="Xsolla" />

export const stripe = (props: IconProps = {}) => <Image
            src={require('../../images/icons/brands/stripe.jpg')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="Stripe" />

export const paddle = (props: IconProps = {}) => <Image
            src={require('../../images/icons/brands/paddle.jpeg')}
            width={0} height={0} style={{ width: props.width || '32px', height: 'auto', display: 'inline-block', marginRight: props.marginRight || '0px' }}
            alt="Paddle" />