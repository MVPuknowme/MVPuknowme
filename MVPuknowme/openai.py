"""OpenAI helpers for MVPuknowme."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Optional

from openai import OpenAI


@dataclass
class MVPuknowmeOpenAI:
    """Small wrapper around the OpenAI client for Aura-Core style integrations."""

    api_key: Optional[str] = None
    model: str = "gpt-4o-mini"

    def __post_init__(self) -> None:
        key = self.api_key or os.getenv("OPENAI_API_KEY")
        if not key:
            raise ValueError("OPENAI_API_KEY is not set")
        self.client = OpenAI(api_key=key)

    def chat(self, prompt: str, *, model: Optional[str] = None, **kwargs: Any) -> str:
        response = self.client.responses.create(
            model=model or self.model,
            input=prompt,
            **kwargs,
        )
        return response.output_text


def build_client(api_key: Optional[str] = None, model: str = "gpt-4o-mini") -> MVPuknowmeOpenAI:
    return MVPuknowmeOpenAI(api_key=api_key, model=model)
