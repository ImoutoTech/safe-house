import { Display, Image, Tag, Spacer } from "@geist-ui/core";

import styles from "./style.module.scss";

const Info = () => {
  return (
    <div className={styles.info}>
      <Display shadow caption="User 的 🆔卡">
        <div className={styles["info-card"]}>
          <Image
            className={styles.avatar}
            src="https://cdn.exia.xyz/img/blog/kal.webp"
            alt="user"
            width="150px"
            height="150px"
          />
          <div className={styles.meta}>
            <h2>
              User <span className={styles.id}># 26</span>
            </h2>

            <div className={styles.footer}>
              <div className={styles.item}>
                <Tag type="success" invert>
                  管理员
                </Tag>
                <Spacer w={0.5} inline />
                <Tag type="lite">用户</Tag>
              </div>
              <div className={styles.item}>
                <span>youranreus@qq.com</span>
              </div>
            </div>
          </div>
        </div>
      </Display>
    </div>
  );
};

export default Info;
