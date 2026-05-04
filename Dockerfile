FROM ruby:3.2

RUN apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1000 vscode && \
    useradd -m -u 1000 -g vscode vscode

# Gems 装到 /gems，不在 /usr/src/app 里，不会被 -v 挂载覆盖
ENV BUNDLE_PATH=/gems
ENV BUNDLE_BIN=/gems/bin
ENV PATH="/gems/bin:$PATH"

RUN gem install bundler:2.3.25

# 先只复制 Gemfile 和 lock，利用 Docker 层缓存
# Gemfile 没变时这两层直接走缓存，build 极快
WORKDIR /install
COPY Gemfile Gemfile.lock ./
RUN bundle _2.3.25_ install

WORKDIR /usr/src/app
RUN chown -R vscode:vscode /usr/src/app /gems
USER vscode

CMD ["jekyll", "serve", "-H", "0.0.0.0"]
